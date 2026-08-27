const moneyFormatter = new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
});

export function formatMoney(amount: string | number) {
    const value = Number(amount);

    if (Number.isNaN(value)) {
        return `Rs ${moneyFormatter.format(0)}`;
    }

    return `Rs ${moneyFormatter.format(value)}`;
}

export function formatDate(date: string) {
    const value = new Date(`${date}T00:00:00`);

    if (Number.isNaN(value.getTime())) {
        return date;
    }

    return dateFormatter.format(value);
}
