import { Checkbox } from '@ark-ui/react/checkbox';
import { CheckIcon } from 'lucide-react';

export default function BasicCheckbox() {
  return (
    <Checkbox.Root className="flex cursor-pointer items-center gap-3">
      <Checkbox.Control className="flex h-5 w-5 items-center justify-center rounded border-2 border-gray-300 bg-white transition-all duration-200 data-hover:border-gray-400 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:data-hover:border-gray-400 dark:data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-500">
        <Checkbox.Indicator>
          <CheckIcon className="h-3.5 w-3.5 text-white" />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100">
        Accept terms and conditions
      </Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  );
}
