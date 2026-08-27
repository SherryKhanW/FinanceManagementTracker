export function ButtonSpinner() {
    return (
        <span
            aria-hidden="true"
            className="h-4 w-4 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
        />
    );
}
