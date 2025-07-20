export interface IButtonProps {
  text: string;
  openModal: () => void;
}

const AddButton = ({ text, openModal }: IButtonProps) => {
  return (
    <div>
      <button
        className="bg-button text-white w-[137px] h-[38px] rounded-md borde hover:bg-violet-500"
        onClick={openModal}
      >
        {text}
      </button>
    </div>
  );
};

export default AddButton;
