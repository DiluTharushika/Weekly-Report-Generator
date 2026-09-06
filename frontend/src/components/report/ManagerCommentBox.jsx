export default function ManagerCommentBox({ comment }) {
  if (!comment) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="text-sm font-semibold text-amber-900">Manager comment</div>
      <div className="mt-1 text-sm text-amber-900/90 whitespace-pre-wrap">
        {comment}
      </div>
    </div>
  );
}