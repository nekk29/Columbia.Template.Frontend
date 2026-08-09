import error404Image from '@/assets/images/error/error-404.png';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-100 px-6 py-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-background-100 shadow-xl">
        <div className="grid items-center gap-10 p-8 md:grid-cols-2 md:p-12 lg:p-16">
          <div className="order-2 md:order-1">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              404 error
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-4 text-md leading-8 text-white">
              The page you are looking for may have been moved, deleted, or never existed.
              Please return to the homepage and continue from there.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Go back home
              </a>
              <a
                href="javascript:history.back()"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-100 hover:text-gray-600"
              >
                Previous page
              </a>
            </div>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <img
              width={300}
              src={error404Image}
              alt="404 illustration"
              className="max-w-md object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
