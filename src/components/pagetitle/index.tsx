interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return <h1 className="text-2xl text-gray-700 mb-8">{title}</h1>;
};

export default PageTitle;
