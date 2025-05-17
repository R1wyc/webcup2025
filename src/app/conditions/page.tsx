'use client';

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Conditions d'utilisation</h1>
        
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
          <p>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">1. Acceptation des conditions</h2>
          <p>
            En utilisant TheEnd.page, vous acceptez de respecter ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">2. Description du service</h2>
          <p>
            TheEnd.page est une plateforme qui permet aux utilisateurs de créer et de partager des pages personnalisées pour marquer la fin d'emplois, de projets, de relations ou d'autres événements.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">3. Comptes utilisateurs</h2>
          <p>
            Pour utiliser certaines fonctionnalités de notre service, vous devez créer un compte. Vous êtes responsable de maintenir la confidentialité de vos informations de connexion et de toutes les activités qui se produisent sous votre compte.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">4. Contenu de l'utilisateur</h2>
          <p>
            En publiant du contenu sur TheEnd.page, vous conservez tous vos droits de propriété, mais vous nous accordez une licence mondiale, non exclusive, libre de redevance pour utiliser, reproduire, adapter, publier, traduire et distribuer votre contenu.
          </p>
          <p>
            Vous êtes entièrement responsable du contenu que vous publiez. Le contenu ne doit pas être illégal, offensant, menaçant, diffamatoire, pornographique ou autrement inapproprié.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">5. Utilisation acceptable</h2>
          <p>
            Vous acceptez de ne pas utiliser TheEnd.page pour :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violer des lois ou règlements</li>
            <li>Usurper l'identité d'une personne ou entité</li>
            <li>Harceler, intimider ou menacer d'autres utilisateurs</li>
            <li>Distribuer des virus ou d'autres technologies malveillantes</li>
            <li>Perturber ou interférer avec le fonctionnement du service</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">6. Résiliation</h2>
          <p>
            Nous nous réservons le droit de suspendre ou de résilier votre compte si vous violez ces conditions d'utilisation.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">7. Modifications des conditions</h2>
          <p>
            Nous pouvons modifier ces conditions à tout moment. Les changements prendront effet dès leur publication sur cette page.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">8. Contact</h2>
          <p>
            Pour toute question concernant ces conditions, contactez-nous à terms@theend.page.
          </p>
        </div>
      </div>
    </div>
  );
} 