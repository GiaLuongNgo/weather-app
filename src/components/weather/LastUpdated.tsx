interface LastUpdatedProps {
  lastUpdated: Date;
}

export default function LastUpdated({ lastUpdated }: LastUpdatedProps) {
  return (
    <div className="text-xs text-white/60 text-center mt-2 sm:mt-3" data-testid="last-updated">
      Last updated: {lastUpdated.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })} at {lastUpdated.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })}
    </div>
  );
}
