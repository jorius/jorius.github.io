// packages
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFound = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="font-mono text-xs tracking-widest uppercase opacity-40 mb-4">
        {t('notFound.title')}
      </p>
      <p className="text-base opacity-60 mb-8">
        {t('notFound.body')}
      </p>
      <Link
        to="/"
        className="font-mono text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
      >
        {t('notFound.home')}
      </Link>
    </div>
  );
};

export default NotFound;
