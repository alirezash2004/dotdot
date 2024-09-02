import { useState } from "react";
import { motion, useMotionValue } from "framer-motion";

import { CiMedicalCross } from "react-icons/ci";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
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
		};

		return (
			<div className="relative overflow-hidden w-full">
				<motion.div
					drag="x"
					dragConstraints={{
						left: 0,
						right: 0,
					}}
					style={{
						x: dragX,
					}}
					animate={{
						translateX: `-${imgIndex * 100}%`,
					}}
					transition={SPRING_OPTIONS}
					onDragEnd={onDragEnd}
					className="flex cursor-grab items-center active:cursor-grabbing"
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
						<div className="relative w-11/12 mx-auto">
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
								className="rounded-lg mx-auto object-cover"
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
