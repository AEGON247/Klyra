# generate_questions.py

import os
import json
from transformers import pipeline

# Load the question-answer generation model
generator = pipeline('question-answer-generation')

def generate_questions(topic):
    # Generate questions and answers using the model
    questions = []
    answers = []
    for _ in range(6):
        output = generator(topic, max_length=50)
        questions.append(output['question'])
        answers.append(output['answer'])

    return {'questions': questions, 'answers': answers}

if __name__ == '__main__':
    from flask import Flask, request, jsonify
    app = Flask(__name__)

    @app.route('/generate-questions', methods=['GET'])
    def generate_questions_endpoint():
        topic = request.args.get('topic')
        data = generate_questions(topic)
        return jsonify(data)

    app.run(debug=True)