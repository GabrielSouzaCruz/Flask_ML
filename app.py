import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

model = pickle.load(open("model.pkl", "rb"))
names = pickle.load(open("names.pkl", "rb"))

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "API Online",
        "message": "API de Machine Learning (Iris Classifier) em execução!",
        "versao": "1.0"
    })

@app.route("/api/predict", methods=["POST"])
def predict():
    dados = request.get_json(force=True)
    valores_entrada = list(dados.values())
    array_features = np.array([valores_entrada])
    predicao_cod = model.predict(array_features)
    nome_especie = names[predicao_cod[0]]
    return jsonify({
        "codigo": int(predicao_cod[0]),
        "dados_recebidos": dados,
        "predicao": nome_especie
    })

if __name__ == "__main__":
    app.run(port=5000)