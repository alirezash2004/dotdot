const Input = ({ Icon, type, placeholder, name, onChange, value, className }) => {
	return (
		<label className={`input input-bordered flex items-center gap-2 ${className}`}>
			{Icon}
			<input
				type={type}
				className="grow"
				placeholder={placeholder}
				name={name}
				onChange={onChange}
				value={value}
			/>
		</label>
	);
};

export default Input;
