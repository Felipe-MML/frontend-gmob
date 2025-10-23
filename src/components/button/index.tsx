export interface IButtonProps {
  text: string;
}

const Button = ({ text }: IButtonProps) => {
  return (
    <div>
      <button
        className="
      bg-button 
      text-white 
      font-bold 
      w-[386px] 
      h-[38px] 
      rounded-md 
      hover:bg-violet 
      hover:text-black 
      hover:cursor-pointer
      transition 
      duration-300"
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
