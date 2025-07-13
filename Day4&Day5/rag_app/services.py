import os
import openai
from dotenv import load_dotenv
import chromadb
from chromadb.config import Settings
import json

# Load environment variables
load_dotenv('config.env')

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')
MODEL_NAME = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')

class RAGService:
    def __init__(self):
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./chroma_db"
        ))
        self.collection = self.client.get_or_create_collection(
            name="iti_documents",
            metadata={"hnsw:space": "cosine"}
        )
        
    def load_documents(self, file_path):
        """Load documents from file and store in vector database"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Split content into chunks (simple splitting by paragraphs)
            chunks = [chunk.strip() for chunk in content.split('\n\n') if chunk.strip()]
            
            # Store chunks in vector database
            documents = []
            metadatas = []
            ids = []
            
            for i, chunk in enumerate(chunks):
                documents.append(chunk)
                metadatas.append({"source": file_path, "chunk_id": i})
                ids.append(f"chunk_{i}")
            
            if documents:
                self.collection.add(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids
                )
                return f"Successfully loaded {len(documents)} chunks from {file_path}"
            else:
                return "No content found in the file"
                
        except Exception as e:
            return f"Error loading documents: {str(e)}"
    
    def search_documents(self, query, n_results=3):
        """Search for relevant documents"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )
            return results
        except Exception as e:
            return {"error": str(e)}
    
    def generate_response(self, query, context_docs):
        """Generate response using OpenAI with retrieved context"""
        try:
            # Prepare context from retrieved documents
            context = "\n\n".join(context_docs)
            
            # Create the prompt
            prompt = f"""You are a helpful assistant for ITI (Information Technology Institute) information. 
            Use the following context to answer the user's question. If the context doesn't contain enough 
            information to answer the question, say so.

            Context:
            {context}

            Question: {query}

            Answer:"""
            
            # Generate response using OpenAI
            response = openai.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant for ITI information. Provide accurate and helpful responses based on the given context."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"Error generating response: {str(e)}"
    
    def query(self, user_question):
        """Main query method that combines search and generation"""
        try:
            # Search for relevant documents
            search_results = self.search_documents(user_question)
            
            if "error" in search_results:
                return f"Error searching documents: {search_results['error']}"
            
            # Extract documents from search results
            if search_results['documents'] and search_results['documents'][0]:
                context_docs = search_results['documents'][0]
            else:
                return "No relevant documents found for your question."
            
            # Generate response
            response = self.generate_response(user_question, context_docs)
            return response
            
        except Exception as e:
            return f"Error processing query: {str(e)}"
    
    def get_collection_info(self):
        """Get information about the vector collection"""
        try:
            count = self.collection.count()
            return {
                "total_documents": count,
                "collection_name": "iti_documents"
            }
        except Exception as e:
            return {"error": str(e)} 