const SearchPageItemSkeleton = ({ hideDivider = false }) => {
	return (
		<tr className="flex justify-between border-none">
			<td className="flex-1 ">
				<div className="flex items-center gap-3">
					<div className="avatar">
						<div className="mask mask-squircle h-12 w-12 skeleton"></div>
					</div>
					<div className="flex flex-col gap-2">
						<div className="w-16 h-3 skeleton"></div>
						<div className="w-12 h-3 skeleton"></div>
					</div>
				</div>
				{!hideDivider && <div className="divider my-0 mt-4 py-0 h-1" />}
			</td>
		</tr>
	);
};

export default SearchPageItemSkeleton;
