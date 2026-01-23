# SupportDesk

# 📌 Customer Support Ticket Classification and Routing
CP5 – Mid-Build Progress Check
# 📖 Project Overview

Large organizations receive a high volume of customer support tickets daily. Manually categorizing and routing these tickets is time-consuming and error-prone.

This project implements an AI-based ticket classification system that automatically:

Cleans incoming ticket text

Classifies tickets into predefined issue categories

Helps route tickets to the appropriate support team

This submission represents the CP5 Mid-Build stage, focusing on building a working ML pipeline.

# 🎯 Objectives

Preprocess and clean raw ticket data

Build a baseline machine learning model

Improve the model using better preprocessing and vectorization

Evaluate model performance using metrics

Maintain clean and readable code structure

# 🗂 Dataset Description

The dataset consists of customer support tickets.

Each record contains:

Ticket text (user complaint or query)

Corresponding category/label

Dataset is loaded locally and split into training and testing sets.

# 🧹 Data Cleaning & Preprocessing

The following preprocessing steps were implemented:

Converted text to lowercase

Removed punctuation and special characters

Removed extra whitespace

Handled missing values

Tokenized text

Converted text to numerical features using TF-IDF Vectorization

These steps ensure the model receives clean and meaningful input data.

# 🤖 Model Training

Two models were trained for comparison:

🔹 Baseline Model

Simple machine learning classifier

Minimal preprocessing

Used to establish a performance benchmark

🔹 Improved Model

Enhanced text preprocessing

TF-IDF feature extraction

Trained using a supervised classification algorithm

Better performance compared to the baseline

# 📊 Evaluation & Metric Tracking

Model performance was evaluated using Accuracy

Accuracy was chosen for its simplicity and suitability for mid-build evaluation

Final Accuracy Achieved:

~64%


Metric tracking was implemented by evaluating the trained model on unseen test data and printing evaluation results.

# 📈 Baseline vs Improved Model
Model Type	Description	Performance
Baseline Model	Minimal preprocessing	Lower accuracy
Improved Model	Cleaned data + TF-IDF	Higher accuracy

This comparison shows that preprocessing and feature engineering significantly improve model performance.

# 🧱 Code Structure & Clarity

The project code follows a clear and logical pipeline:

Dataset loading

Data cleaning and preprocessing

Feature extraction

Model training

Model evaluation

Variables are clearly named

Code is modular and readable

Sections are logically separated

This structure makes the project easy to understand and extend.

# ⚠ Limitations

Only accuracy metric is used (advanced metrics like F1-score can be added later)

Dataset size is limited

No real-time deployment in this stage

# 🚀 Future Enhancements

Add precision, recall, and F1-score

Implement deep learning models (LSTM / BERT)

Integrate real-time ticket routing

Deploy using a web interface or API

# ✅ CP5 Completion Summary

✔ Data cleaning implemented
✔ Model training working
✔ Baseline vs improved comparison done
✔ Metric tracking implemented
✔ Code structure clear and readable

# 👤 Author

Project by: Kundeti Monasri, Oruganti Sania Mary, Malkedi Nandidni, Varshita Pallapothu
Domain: Machine Learning / NLP
