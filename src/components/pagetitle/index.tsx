interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return <h1 className="text-3xl font-bold text-gray-700">{title}</h1>;
};

export default PageTitle;
