// EventCard.js
import React from "react";

const Card = ({ id, title, description, date, location, image, status}) => {
  return (
    <article className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x225/1f2937/ffffff?text=Achievement";
            }}
          />
          {status && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {status}
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">{title}</h3>
        {(date || location) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            {date && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                {date}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                {location}
              </span>
            )}
          </div>
        )}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </article>
  );
};

export default Card;