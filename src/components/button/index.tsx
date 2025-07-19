export interface IButtonProps {
  text: string;
}

const Button = ({ text }: IButtonProps) => {
  return (
    <div>
      <button className="bg-button text-white w-[386px] h-[38px] rounded-md border border-black hover:bg-violet-500">
        {text}
      </button>
    </div>
  );
};

export default Button;
