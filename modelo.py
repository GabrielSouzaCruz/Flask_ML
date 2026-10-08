import numpy as np
import pandas as pd
from sklearn import tree
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

# 1. Carregar os dados
csv_url = 'https://docs.google.com/spreadsheets/d/1mZZMHEtyg8aiQT2fEBO_QcGhIgpKifqvz8wkEz3-kng/export?format=csv&'
df = pd.read_csv(csv_url)

# 2. Mapeamento de rótulos
variedade_replace = {'Setosa': 0, 'Versicolor': 1, 'Virginica': 2}
df['especie_cod'] = df['especie'].map(variedade_replace)
iris_list = ['Setosa', 'Versicolor', 'Virginica']

# 3. Separar Features (X) e Target (y)
X = df.drop(columns=['especie', 'especie_cod'])
y = df['especie_cod']

# 4. Divisão Treino e Teste
X_train, X_test, y_train, y_test = train_test_split(X.values, y.values, test_size=0.3, random_state=50)

# 5. Treinar o Classificador
clf = tree.DecisionTreeClassifier()
clf = clf.fit(X_train, y_train)

# 6. Salvar/Exportar o modelo e os nomes em arquivos binários (.pkl)
pickle.dump(clf, open('model.pkl', 'wb'))
pickle.dump(iris_list, open('names.pkl', 'wb'))

print("Modelo e lista de nomes exportados com sucesso!")