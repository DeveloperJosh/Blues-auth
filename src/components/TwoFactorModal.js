import { Fragment } from 'react';
import { Dialog, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

const TwoFactorModal = ({ isOpen, onClose, onSubmit, twoFactorToken, setTwoFactorToken }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Use Dialog.Overlay directly instead of Dialog.Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </TransitionChild>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-lg">
              <DialogTitle as="h3" className="text-lg font-medium leading-6 text-white">
                Enter 2FA Code
              </DialogTitle>
              <form onSubmit={onSubmit}>
                <div className="mt-4">
                  <label htmlFor="twoFactorToken" className="block text-sm font-medium text-gray-400">
                    2FA Code
                  </label>
                  <input
                    type="text"
                    id="twoFactorToken"
                    value={twoFactorToken}
                    onChange={(e) => setTwoFactorToken(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-700 text-white"
                    required
                    placeholder="Enter your 2FA code"
                  />
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TwoFactorModal;
