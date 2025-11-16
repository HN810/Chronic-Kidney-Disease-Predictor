# Chronic Kidney Disease Predictor

A machine-learning project that builds an optimized **Random Forest Classifier** to predict the likelihood of Chronic Kidney Disease (CKD) using key metabolic and clinical indicators.  
The model is trained using a hyperparameter tuning pipeline (GridSearchCV) and exported for use in production or clinical research scenarios.

---

## 🔬 Technical Overview

This project uses a clinical dataset containing renal biomarkers and patient health indicators.  
The predictive pipeline includes:

### **Features Used**
- `Age`
- `BUN` (Blood Urea Nitrogen)
- `Diabetes` (binary)
- `Creatinine_Level`
- `Hypertension` (binary)
- `GFR` (Glomerular Filtration Rate)

### **Target Variable**
- `CKD_Status` (0 = No CKD, 1 = CKD)

### **Modeling Process**
1. **Data Loading** using pandas  
2. **Feature Selection**  
3. **Train/Test Split**  
   - 80/20 split  
   - Stratified to preserve CKD distribution  
4. **Hyperparameter Optimization**  
   - Tuned using **GridSearchCV**  
   - 5-fold cross-validation  
5. **Model Training** using the best Random Forest configuration  
6. **Evaluation Metrics**
   - Accuracy
   - Precision/Recall/F1-score
   - Full sklearn classification report  
7. **Model Serialization**
   - Exported using `pickle` as `ckd_model.pkl`  
8. **Example Case (FOR TESTING PURPOSES)**
   - Generates CKD probability for a new patient  

## NOTES

This model is educational and should not be used for real medical diagnosis. Always consult clinical professionals for healthcare decisions.
