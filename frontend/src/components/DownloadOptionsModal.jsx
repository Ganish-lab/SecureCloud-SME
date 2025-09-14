import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function DownloadOptionsModal({ isOpen, setIsOpen, onDownload }) {
  const [includeQR, setIncludeQR] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [useColorTheme, setUseColorTheme] = useState(true);

  const handleDownload = () => {
    onDownload({ includeQR, includeCharts, useColorTheme });
    setIsOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  PDF Download Options
                </Dialog.Title>

                <div className="mt-4 space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" checked={includeQR} onChange={(e) => setIncludeQR(e.target.checked)} className="mr-2"/>
                    Include QR Code linking to live scan
                  </label>

                  <label className="flex items-center">
                    <input type="checkbox" checked={includeCharts} onChange={(e) => setIncludeCharts(e.target.checked)} className="mr-2"/>
                    Include Charts in PDF
                  </label>

                  <label className="flex items-center">
                    <input type="checkbox" checked={useColorTheme} onChange={(e) => setUseColorTheme(e.target.checked)} className="mr-2"/>
                    Use Color Theme (Branded)
                  </label>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-gray-200 rounded-lg" onClick={() => setIsOpen(false)}>
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={handleDownload}>
                    Download PDF
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}