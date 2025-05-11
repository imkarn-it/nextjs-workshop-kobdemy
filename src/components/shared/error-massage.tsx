const ErrorMessage = ({ error }: { error: string }) => {
  return <span className="text-sm text-red-400">{error}</span>;
};
export default ErrorMessage;
