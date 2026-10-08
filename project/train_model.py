import pandas as pd
import pickle
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import GridSearchCV

dd = pd.read_csv('kidney_disease_dataset.csv')
X = dd[['Age', 'BUN', 'Diabetes', 'Creatinine_Level', 'Hypertension', 'GFR']]
y = dd['CKD_Status']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=2)

param_grid = {
    'n_estimators': [200, 400, 600],
    'max_depth': [7, 10, 15],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=5, scoring='accuracy')
grid.fit(X_train, y_train)

best_model = grid.best_estimator_

y_pred = best_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Test Accuracy: {accuracy:.4f}")
print("\nClassification Report:\n", classification_report(y_test, y_pred))

with open('ckd_model.pkl', 'wb') as f:
    pickle.dump(best_model, f)

print("Model saved as ckd_model.pkl")

new_patient = pd.DataFrame({
    'Age': [18],
    'BUN': [11],
    'Diabetes': [0],
    'Creatinine_Level': [44],
    'Hypertension': [0],
    'GFR': [120]
})
prob = best_model.predict_proba(new_patient)[:, 1] * 100
print(f"CKD Probability for new patient: {prob[0]:.2f}%")
