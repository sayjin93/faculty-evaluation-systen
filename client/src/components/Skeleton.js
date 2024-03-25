import React from "react";

const Skeleton = ({ times = 1, className = "" }) => {
    const boxes = Array(times)
        .fill(0)
        .map((_, i) => {
            return (
                <div key={i} className={`skeleton ${className}`}>
                    <div className="skeleton-inner" />
                </div>
            );
        });

    return <>{boxes}</>;
};

export default Skeleton;
