from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .simple_rag import SimpleRAGService
import os

# Initialize RAG service
rag_service = SimpleRAGService()

def index(request):
    """Main page view"""
    return render(request, 'rag_app/index.html')

@csrf_exempt
@require_http_methods(["POST"])
def chat(request):
    """Handle chat queries"""
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '')
        
        if not user_message:
            return JsonResponse({'error': 'No message provided'}, status=400)
        
        # Get response from RAG service
        response = rag_service.query(user_message)
        
        return JsonResponse({
            'response': response,
            'user_message': user_message
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def load_documents(request):
    """Load documents into the vector database"""
    try:
        # Check if data.txt exists
        data_file = 'data.txt'
        if not os.path.exists(data_file):
            return JsonResponse({'error': 'data.txt file not found'}, status=404)
        
        # Load documents
        result = rag_service.load_documents(data_file)
        
        return JsonResponse({
            'message': result,
            'file': data_file
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def get_collection_info(request):
    """Get information about the vector collection"""
    try:
        info = rag_service.get_collection_info()
        return JsonResponse(info)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
