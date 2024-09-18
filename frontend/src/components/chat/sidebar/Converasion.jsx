const Converasion = () => {
	return (
		<>
			<div className="flex gap-3 items-center hover:bg-accent hover:text-black transition-all duration-300 rounded p-2 py-3 cursor-pointer">
				<div className="avatar online">
					<div className="w-10 rounded-full">
						<img src="https://avatar.iran.liara.run/public" alt="Avatar" />
					</div>
				</div>
				<div className="flex flex-col flex-1">
					<div className="flex gap-3 justify-between">
						<p className="text-sm font-bold">John Doe</p>
						<span>2h</span>
					</div>
				</div>
			</div>
            <div className="divider my-0 py-0 h-1" />
		</>
	);
};

export default Converasion;
