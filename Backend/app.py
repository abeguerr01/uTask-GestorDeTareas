from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def root():
    return "Flask API funciona correctamente"

@app.route('/users/<user_id>')
def get_users(user_id):
    user = {"id": user_id, "Nombre": "Alice", "telefono": "1234567890", "email": "example@example.com"}
    # /users/2654?query=query_test
    query = request.args.get("query")
    if query:
        user ["query"] = query
    return jsonify(user), 200

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    return jsonify(data), 201

if __name__ == '__main__':
    app.run(debug=True)