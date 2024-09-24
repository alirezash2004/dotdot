import { useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";

import { CiHeart, CiMedicalCross } from "react-icons/ci";

const DRAG_BUFFER = 20;

const SPRING_OPTIONS = {
	type: "spring",
	mass: 3,
	stiffness: 400,
	damping: 50,
};

const HorizontalScrollCarousel = ({ imgs, handleDeleteImage }) => {
	const [imgIndex, setImgIndex] = useState(0);
	const SwipeCarousel = () => {
		const dragX = useMotionValue(0);

		const onDragEnd = () => {
			const x = dragX.get();

			if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {
				setImgIndex((pv) => pv + 1);
			} else if (x >= DRAG_BUFFER && imgIndex > 0) {
				setImgIndex((pv) => pv - 1);
			}
			setImgIndex((pv) => pv);
		};

		const sequance = (selector) => {
			return [
				[
					selector,
					{
						scale: 1,
						translateX: "-50%",
						translateY: "-50%",
						opacity: 1,
						display: "block",
					},
					{ duration: 0 },
				],
				[selector, { scale: 1.5, translateX: "-50%", translateY: "-50%" }],
				[
					selector,
					{
						scale: 1,
						translateX: "-50%",
						translateY: "-50%",
						opacity: 0,
						display: "none",
					},
				],
			];
		};

		const PID = !handleDeleteImage
			? imgs[0].split("/")[4].split(".")[0].slice(7)
			: "";

		return (
			<div className="relative overflow-hidden w-full">
				<div
					className={`hidden opacity-0 absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 ${PID}`}
				>
					<CiHeart className="w-24 h-24 bg-red-600 rounded-full" />
				</div>
				<motion.div
					drag="x"
					dragConstraints={{
						left: 0,
						right: 0,
						top: 0,
						bottom: 0,
					}}
					style={{
						x: dragX,
					}}
					animate={{
						translateX: `-${imgIndex * 100}%`,
						translateY: `-0%`,
					}}
					transition={SPRING_OPTIONS}
					onDragEnd={onDragEnd}
					className="flex cursor-grab items-center active:cursor-grabbing"
					onDoubleClick={() =>
						!handleDeleteImage ? animate(sequance("." + PID)) : ""
					}
				>
					<Images imgIndex={imgIndex} />
				</motion.div>
				<Dots imgIndex={imgIndex} setImgIndex={setImgIndex} />
			</div>
		);
	};

	const Images = ({ imgIndex }) => {
		return (
			<>
				{imgs.length > 1 &&
					imgs.map((imgSrc, idx) => {
						return (
							<motion.div
								key={idx}
								style={{
									backgroundImage: `url(${
										handleDeleteImage ? imgSrc.blob : imgSrc
									})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}}
								animate={{
									scale: imgIndex === idx ? 0.95 : 0.85,
								}}
								transition={SPRING_OPTIONS}
								className="aspect-square h-full w-full shrink-0 rounded-xl bg-neutral-800 object-cover "
							>
								{handleDeleteImage && (
									<div
										className="flex items-center absolute -top-6 -right-6 cursor-pointer text-red-700 bg-slate-900 p-2 rounded-full w-12 h-12 btn-outline btn-square btn"
										onClick={() => {
											setImgIndex((prevIndex) =>
												prevIndex !== 0 ? prevIndex - 1 : 0
											);
											handleDeleteImage(imgSrc);
										}}
									>
										<CiMedicalCross className="rotate-45 w-6 h-6" />
									</div>
								)}
							</motion.div>
						);
					})}
				{imgs.length == 1 && !handleDeleteImage && (
					<motion.img
						animate={{
							scale: 0.95,
						}}
						transition={SPRING_OPTIONS}
						src={imgs[0]}
						alt=""
						className="rounded-lg mx-auto object-cover pointer-events-none"
					/>
				)}
				{imgs.length == 1 && handleDeleteImage && (
					<>
						<div className="relative w-8/12 mx-auto">
							<div
								className="flex items-center absolute top-0 right-0 z-50 cursor-pointer text-red-700 bg-slate-900 p-2 rounded-full w-12 h-12 btn-outline btn-square btn"
								onClick={() => {
									setImgIndex((prevIndex) =>
										prevIndex !== 0 ? prevIndex - 1 : 0
									);
									handleDeleteImage(imgs[0]);
								}}
							>
								<CiMedicalCross className="rotate-45 w-6 h-6" />
							</div>
							<motion.img
								animate={{
									scale: 0.95,
								}}
								transition={SPRING_OPTIONS}
								src={imgs[0].blob}
								alt=""
								className="rounded-lg mx-auto object-cover pointer-events-none"
							/>
						</div>
					</>
				)}
			</>
		);
	};

	const Dots = ({ imgIndex, setImgIndex }) => {
		return (
			<>
				{imgs.length > 1 && (
					<div className="mt-4 flex w-full justify-center gap-2">
						{imgs.map((_, idx) => {
							return (
								<button
									key={idx}
									onClick={() => setImgIndex(idx)}
									className={`h-3 w-3 rounded-full transition-colors ${
										idx === imgIndex ? "bg-neutral-50" : "bg-neutral-500"
									}`}
								/>
							);
						})}
					</div>
				)}
			</>
		);
	};

	return SwipeCarousel();
};

export default HorizontalScrollCarousel;
