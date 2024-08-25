const ProfileTopSkeleton = () => {
	return (
		<>
			<div className="flex items-center flex-col gap-7 md:gap-0 md:flex-row w-full justify-around mt-8">
				<div className="flex flex-col md:flex-row items-center gap-3">
					<div className="w-20 h-20 md:h-32 md:w-32 rounded-full skeleton"></div>
					<div className="flex flex-col gap-3 items-center md:items-start">
						<div className="skeleton w-20 h-4"></div>
						<div className="skeleton w-28 h-4"></div>
					</div>
				</div>

				<div className="join justify-around">
					<div className="btn btn-outline border-slate-700 px-3 md:px-7 h-14 md:h-20 no-animation join-item flex flex-col md:gap-4 hover:bg-slate-800 skeleton w-24 md:w-32"></div>
					<div className="btn btn-outline border-slate-700 px-3 md:px-7 h-14 md:h-20 no-animation join-item flex flex-col md:gap-4 hover:bg-slate-800 skeleton w-24 md:w-32"></div>
					<div className="btn btn-outline border-slate-700 px-3 md:px-7 h-14 md:h-20 no-animation join-item flex flex-col md:gap-4 hover:bg-slate-800 skeleton w-24 md:w-32"></div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row items-center w-full justify-around mt-5 gap-5 md:gap-0">
				<div className="flex flex-col gap-3 items-start">
					<div className="skeleton w-28 h-4"></div>
					<div className="skeleton w-28 h-4"></div>
				</div>
				<button className="skeleton w-40 h-14 mt-4"></button>
			</div>
		</>
	);
};

export default ProfileTopSkeleton;
