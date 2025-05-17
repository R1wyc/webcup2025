'use client';

import { useState, useEffect } from 'react';

interface FaqQuestion {
  question: string;
  answer: string;
}

interface FormData {
  name: string;
  email: string;
  question: string;
  date: string;
}

export default function FaqPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedQuestions, setSubmittedQuestions] = useState<FormData[]>([]);

  // Load previously submitted questions from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem('faqFormData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setSubmittedQuestions(Array.isArray(parsedData) ? parsedData : []);
      } catch (error) {
        console.error('Error parsing stored FAQ data:', error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new form data entry with timestamp
    const newEntry: FormData = {
      ...formData,
      date: new Date().toISOString()
    };
    
    // Add to local array of submitted questions
    const updatedQuestions = [...submittedQuestions, newEntry];
    setSubmittedQuestions(updatedQuestions);
    
    // Save to localStorage
    localStorage.setItem('faqFormData', JSON.stringify(updatedQuestions));
    
    // Show success message
    setSubmitted(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      question: ''
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  // FAQ questions
  const faqs: FaqQuestion[] = [
    {
      question: "Qu'est-ce que TheEnd.page ?",
      answer: "TheEnd.page est une plateforme qui vous permet de créer des pages personnalisées pour marquer la fin d'un emploi, d'un projet, d'une relation ou même d'un serveur."
    },
    {
      question: "Comment créer une page de fin ?",
      answer: "Pour créer une page, inscrivez-vous ou connectez-vous, puis cliquez sur 'Créer une page'. Suivez les étapes pour personnaliser votre message, ajouter des médias et choisir un style."
    },
    {
      question: "Est-ce que les pages sont publiques ?",
      answer: "Oui, les pages que vous créez sont publiques et accessibles via un lien unique. Cependant, elles ne sont pas indexées par les moteurs de recherche sauf si vous le souhaitez."
    },
    {
      question: "Puis-je modifier ma page après l'avoir publiée ?",
      answer: "Oui, vous pouvez modifier ou supprimer votre page à tout moment depuis votre tableau de bord."
    },
    {
      question: "Combien de pages puis-je créer ?",
      answer: "Le compte gratuit vous permet de créer jusqu'à 5 pages. Pour créer plus de pages, vous pouvez passer à un compte premium."
    },
    {
      question: "Comment fonctionne le système de vote ?",
      answer: "Chaque visiteur peut voter une fois par page (positif ou négatif). Les pages avec plus de 10 votes positifs rejoignent notre Hall of Fame."
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Foire Aux Questions</h1>
        
        <div className="space-y-8 mb-12">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-5 last:border-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Vous ne trouvez pas votre réponse ?</h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Posez-nous votre question et nous vous répondrons dans les plus brefs délais.
          </p>
          
          {submitted && (
            <div className="bg-green-50 dark:bg-green-900 border-l-4 border-green-500 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 dark:text-green-200">
                    Merci, votre question a bien été envoyée ! Nous vous répondrons dès que possible.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
              />
            </div>
            
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Votre question
              </label>
              <textarea
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white py-2 px-3"
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105"
              >
                Envoyer ma question
              </button>
            </div>
          </form>
          
          {submittedQuestions.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Questions soumises</h3>
              <div className="space-y-4">
                {submittedQuestions.map((q, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{q.question}</p>
                    <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{q.name}</span>
                      <span>{new Date(q.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 