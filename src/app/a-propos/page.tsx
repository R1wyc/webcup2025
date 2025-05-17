'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">À propos de TheEnd.page</h1>
        
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p>
            Bienvenue sur <strong>TheEnd.page</strong>, la plateforme qui vous permet de créer des pages de fin personnalisées pour marquer différentes fins dans votre vie : emplois, projets, relations, ou même serveurs.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">Notre mission</h2>
          <p>
            Notre mission est de vous aider à célébrer ou commémorer les fins avec créativité et style. Que vous quittiez un emploi, terminiez un projet, ou mettiez fin à une relation, TheEnd.page vous offre un espace pour exprimer vos sentiments et partager votre message.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">Notre histoire</h2>
          <p>
            TheEnd.page a été créé en 2023 par une équipe de développeurs qui croyaient en l'importance de marquer les fins de manière significative. L'idée est née de l'observation que les fins sont souvent négligées, alors qu'elles représentent des moments importants de transition et de croissance.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">Contactez-nous</h2>
          <p>
            Vous avez des questions ou des suggestions ? N'hésitez pas à nous contacter via notre <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">page de contact</Link>.
          </p>
        </div>
      </div>
    </div>
  );
} 