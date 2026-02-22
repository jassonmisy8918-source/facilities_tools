export default function PlaceholderView({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-center p-8 bg-surface border border-themed rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-default">{title} - 施工中</h2>
        </div>
    );
}
