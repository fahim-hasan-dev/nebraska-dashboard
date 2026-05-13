import { ChevronDown, Plus } from "lucide-react";

export default function ResultsView({ results }: { results: any[] }) {
  return (
    <div className="flex flex-col w-full h-full max-w-[1200px] mx-auto pb-20">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Results Management
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-col gap-1.5 w-full sm:w-1/2">
            <label className="text-xs font-semibold text-gray-500">
              Event
            </label>
            <div className="relative">
              <select className="flex h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                <option>Spring Championship Round 1</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-full sm:w-1/2">
            <label className="text-xs font-semibold text-gray-500">
              Class
            </label>
            <div className="relative">
              <select className="flex h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                <option>Pro</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Result Box */}
      <div className="bg-[#f4f8ff] border border-blue-100 rounded-xl p-5 mb-6">
        <h2 className="text-blue-600 font-semibold mb-4">Add Result</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Driver Name"
            className="flex-1 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Tractor #"
            className="flex-1 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Tractor Name"
            className="flex-1 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Distance"
            className="flex-1 h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-blue-600 text-white px-8 h-10 rounded-md font-medium text-sm transition-colors w-full sm:w-[150px] shrink-0">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-bold text-gray-900 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Pos</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Car #</th>
                <th className="px-6 py-4">Car Name #</th>
                <th className="px-6 py-4">Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {results?.map((row) => (
                <tr key={row.pos} className="bg-white hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-600">{row.pos}</td>
                  <td className="px-6 py-4 text-gray-600">{row.driver}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                      {row.carNum}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{row.carName}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{row.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
