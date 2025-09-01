# 🤖 ML RAG Assistant — Frontend Interface

The **ML RAG Assistant** is a sleek, browser-based UI that leverages **Retrieval-Augmented Generation (RAG)** to answer questions from machine learning PDFs. Users ask natural language queries, and the assistant retrieves and ranks relevant snippets with citations, offering an intuitive and informative Q&A experience.

> ⚠️ **Note**: The backend is hosted on [Render](https://pdfquery-hm07.onrender.com). It may take **10–30 seconds** to respond after initial load if idle.

---

## 🧠 Research Foundation

This project is based by the paper:

**Kotsiantis, S. B. (2007). _Supervised Machine Learning: A Review of Classification Techniques_. Informatica, 31(3), 249–268**  
🔗 [Read the Paper](https://www.researchgate.net/publication/220166738_Supervised_Machine_Learning_A_Review_of_Classification_Techniques)

The assistant’s knowledge is based on this comprehensive review of supervised learning.

---

## 🚀 Key Features

- 📚 **Smart PDF Q&A** — Ask ML questions and get answers with cited sources  
- 🧠 **OpenAI-Compatible LLM (GPT‑4.1-nano)** — Lightweight, contextual, and fast  
- 🎯 **Top‑K Control** — Choose how many chunks to retrieve and rank  
- 🧾 **Cited Answers** — Source snippets, match scores, and page numbers  
- ♻️ **Persistent Chat** — Stores history and preferences with localStorage  
- ✅ **Backend Health Monitor** — Live ping to check server availability  
- 📱 **Responsive UI** — Optimized for desktop and mobile

---

## 🧩 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)  
- **Icons**: FontAwesome  
- **Storage**: Browser LocalStorage  
- **Backend**: Flask API deployed on Render  
- **Retrieval**: FAISS + PDF chunking  
- **Model**: GPT-4.1-nano or compatible OpenAI API

---

## 🌐 Backend API

Base URL: `https://pdfquery-hm07.onrender.com`

| Endpoint     | Method | Purpose                    |
|--------------|--------|----------------------------|
| `/health`    | GET    | Check if backend is live   |
| `/ask`       | POST   | Submit question + top_k    |

⚠️ Cold starts can take 10–30 seconds on Render's free plan. Wait until backend status reads “Backend connected.”

---

## 🧪 Sample Use Cases

- “What’s the difference between decision trees and random forests?”  
- “Is logistic regression a generative model?”  
- “How does Naive Bayes handle missing data?”  
- “Compare k-NN vs perceptron in supervised learning.”  

Each response includes traceable citations to chunks from the Kotsiantis paper.

---

## 🛠️ How It Works

1. User enters a question  
2. App sends query to backend `/ask` endpoint  
3. Backend retrieves Top‑K matching chunks using vector similarity  
4. LLM generates a response using those sources  
5. Frontend displays the answer + sources, model tag, and tools (copy, expand)

---

## 📦 Future Enhancements

- 🔐 User-uploaded PDFs  
- 🔄 Real-time collaborative sync  
- 🧠 Multi-model support (Claude, LLaMA, Gemini)  
- 🌍 i18n support  
- 🖍️ Inline PDF highlighting of sources

---

## 👨‍💻 Author

**Mudit Mayank Jha**  
B.Sc. Computer Science @ UWI • Exchange Student @ University of Richmond  
🔗 [GitHub](https://github.com/muditjha20)

---

## 📄 License

MIT — Free for personal and commercial use.

---

## 📚 BibTeX Citation

```bibtex
@article{kotsiantis2007supervised,
  title={Supervised Machine Learning: A Review of Classification Techniques},
  author={Kotsiantis, S. B.},
  journal={Informatica},
  volume={31},
  number={3},
  pages={249--268},
  year={2007}
}
```
