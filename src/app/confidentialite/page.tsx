'use client';

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Politique de confidentialité</h1>
        
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">1. Introduction</h2>
          <p>
            Chez TheEnd.page, nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité vous explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre service.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">2. Données collectées</h2>
          <p>
            Nous collectons les informations suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Informations de compte (nom, adresse e-mail)</li>
            <li>Contenu des pages que vous créez</li>
            <li>Données d'utilisation et analytics</li>
            <li>Cookies et données de navigation</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">3. Utilisation des données</h2>
          <p>
            Nous utilisons vos données pour :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fournir et améliorer notre service</li>
            <li>Personnaliser votre expérience</li>
            <li>Communiquer avec vous</li>
            <li>Assurer la sécurité de notre plateforme</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">4. Partage des données</h2>
          <p>
            Nous ne vendons pas vos données personnelles. Nous pouvons partager certaines informations avec :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nos prestataires de services</li>
            <li>Les autorités légales si la loi l'exige</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">5. Vos droits</h2>
          <p>
            Vous disposez de droits concernant vos données :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Droit d'accès et de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">6. Contact</h2>
          <p>
            Pour toute question concernant cette politique, contactez-nous à privacy@theend.page.
          </p>
        </div>
      </div>
    </div>
  );
} 