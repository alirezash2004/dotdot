const ProfilePostsSkeleton = () => {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3">
			<div className="flex w-full aspect-square border border-slate-800 group/post skeleton rounded-none"></div>
			<div className="flex w-full aspect-square border border-slate-800 group/post skeleton rounded-none"></div>
			<div className="flex w-full aspect-square border border-slate-800 group/post skeleton rounded-none"></div>
			<div className="flex w-full aspect-square border border-slate-800 group/post skeleton rounded-none"></div>
			<div className="hidden md:flex w-full aspect-square border border-slate-800 group/post skeleton rounded-none"></div>
			<div className="hidden md:flex w-full aspect-square border border-slate-800 group/post skeleton rounded-none"></div>
		</div>
	);
};

export default ProfilePostsSkeleton;
