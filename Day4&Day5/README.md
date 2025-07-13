# ITI RAG System

A Retrieval-Augmented Generation (RAG) system built with Django that allows users to ask questions about ITI (Information Technology Institute) programs and information using OpenAI's GPT-4o-mini model.

## Features

- 🤖 AI-powered question answering using OpenAI GPT-4o-mini
- 📚 Document loading and processing from text files
- 💬 Interactive chat interface
- 🔍 Simple keyword-based document retrieval
- 🎨 Modern, responsive web interface
- 🔐 Secure API key management

## Prerequisites

- Python 3.8 or higher
- OpenAI API key
- Internet connection for OpenAI API calls

## Installation & Setup

### 1. Clone or Download the Project

Make sure you have all the project files in your directory.

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `config.env` file in the project root with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

### 4. Run Django Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Start the Development Server

```bash
python manage.py runserver
```

### 6. Access the Application

Open your web browser and go to: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## Usage Instructions

### Step 1: Load Documents

1. Open the web interface
2. Click the **"Load Documents"** button
3. Wait for the confirmation message that documents have been loaded

### Step 2: Ask Questions

1. Type your question in the chat input box
2. Press **Enter** or click **"Send"**
3. Wait for the AI response

### Step 3: Check Database Status (Optional)

- Click **"Check Database Status"** to see how many documents are loaded

## Example Questions You Can Ask

Based on the ITI data in `data.txt`, here are some example questions:

### Program Information

- "What is the ITI 9-Month Scholarship Program?"
- "When does the ITI 9-Month Scholarship Program open?"
- "What is the minimum required grade for applicants?"

### Available Tracks

- "What tracks are available in the ITI program?"
- "Is there a Java track in the ITI program?"
- "What are all the available tracks?"
- "Tell me about the System Development track"

### Eligibility

- "Is the program available for undergraduate students?"
- "Can I apply if I am an undergraduate student?"
- "What are the eligibility requirements?"

### Branches and Locations

- "Which ITI branches offer the program this year?"
- "Where can I find ITI branches?"
- "Is there an ITI branch in Smart Village?"

### Instructors

- "Who are the ITI instructors?"
- "Tell me about the instructors"
- "Who is teaching at ITI?"

### General Information

- "What is ITI?"
- "Tell me about the Information Technology Institute"
- "What programs does ITI offer?"

## Project Structure

```
Day4&Day5/
├── rag_system/          # Django project settings
├── rag_app/            # Main RAG application
│   ├── views.py        # Django views
│   ├── urls.py         # URL routing
│   ├── simple_rag.py   # RAG service (simplified)
│   └── services.py     # RAG service (with vector DB)
├── templates/          # HTML templates
│   └── rag_app/
│       └── index.html  # Main chat interface
├── static/             # Static files (CSS, JS)
├── data.txt           # ITI information data
├── config.env         # Environment variables
├── requirements.txt   # Python dependencies
├── manage.py          # Django management script
└── README.md          # This file
```

## Technical Details

### RAG Implementation

- **Document Loading**: Simple text chunking by paragraphs
- **Retrieval**: Keyword-based search (can be upgraded to vector search)
- **Generation**: OpenAI GPT-4o-mini with context injection

### API Endpoints

- `GET /` - Main chat interface
- `POST /chat/` - Send chat messages
- `POST /load-documents/` - Load documents into the system
- `GET /collection-info/` - Get database status

### Dependencies

- Django 4.2.7 - Web framework
- OpenAI 1.3.7 - AI model integration
- python-dotenv 1.0.0 - Environment variable management

## Troubleshooting

### Common Issues

1. **"Error generating response"**

   - Check your OpenAI API key in `config.env`
   - Ensure you have sufficient OpenAI credits
   - Verify internet connection

2. **"No documents loaded"**

   - Click "Load Documents" button first
   - Check that `data.txt` exists in the project root

3. **Import errors**

   - Run `pip install -r requirements.txt`
   - Make sure you're using Python 3.8+

4. **Django server won't start**
   - Run `python manage.py migrate` first
   - Check for port conflicts (default: 8000)

### API Key Security

- Never commit your API key to version control
- Use environment variables for sensitive data
- Keep your `config.env` file secure

## Upgrading to Vector Search

To upgrade from simple keyword search to vector embeddings:

1. Install additional dependencies:

   ```bash
   pip install chromadb sentence-transformers
   ```

2. Update `views.py` to use `services.py` instead of `simple_rag.py`

3. The vector-based RAG will provide better semantic search capabilities

## Contributing

Feel free to improve the system by:

- Adding more sophisticated document chunking
- Implementing better vector search
- Enhancing the UI/UX
- Adding more data sources

## License

This project is for educational purposes. Please respect OpenAI's usage policies and terms of service.
