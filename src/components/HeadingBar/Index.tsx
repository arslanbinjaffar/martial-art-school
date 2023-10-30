import { HeadingContainer } from "./style";

const Index = ({ title }: any) => {
  return (
    <HeadingContainer>
      <h1>{title}</h1>
      <span className="heading-bar"></span>
    </HeadingContainer>
  );
};

export default Index;
