import os
import openai
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv('config.env')

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')
MODEL_NAME = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')

class SimpleRAGService:
    def __init__(self):
        self.documents = []
        self.loaded = False
        
    def load_documents(self, file_path):
        """Load documents from file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Split content into chunks (simple splitting by paragraphs)
            chunks = [chunk.strip() for chunk in content.split('\n\n') if chunk.strip()]
            
            self.documents = chunks
            self.loaded = True
            return f"Successfully loaded {len(chunks)} chunks from {file_path}"
                
        except Exception as e:
            return f"Error loading documents: {str(e)}"
    
    def search_documents(self, query, n_results=3):
        """Simple keyword-based search"""
        if not self.loaded:
            return {"error": "No documents loaded"}
        
        # Simple keyword matching
        query_words = query.lower().split()
        scored_docs = []
        
        for i, doc in enumerate(self.documents):
            doc_lower = doc.lower()
            score = sum(1 for word in query_words if word in doc_lower)
            if score > 0:
                scored_docs.append((score, doc, i))
        
        # Sort by score and return top results
        scored_docs.sort(reverse=True)
        top_docs = [doc for score, doc, idx in scored_docs[:n_results]]
        
        return {
            'documents': [top_docs] if top_docs else [],
            'metadatas': [],
            'ids': []
        }
    
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
            if not self.loaded:
                return "Please load documents first using the 'Load Documents' button."
            
            # Search for relevant documents
            search_results = self.search_documents(user_question)
            
            if "error" in search_results:
                return f"Error searching documents: {search_results['error']}"
            
            # Extract documents from search results
            if search_results['documents'] and search_results['documents'][0]:
                context_docs = search_results['documents'][0]
            else:
                return "No relevant documents found for your question. Please try rephrasing your question."
            
            # Generate response
            response = self.generate_response(user_question, context_docs)
            return response
            
        except Exception as e:
            return f"Error processing query: {str(e)}"
    
    def get_collection_info(self):
        """Get information about the loaded documents"""
        try:
            return {
                "total_documents": len(self.documents),
                "collection_name": "iti_documents",
                "loaded": self.loaded
            }
        except Exception as e:
            return {"error": str(e)} 