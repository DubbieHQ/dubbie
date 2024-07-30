import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@dubbie/shared/languages";
import { AcceptedLanguage } from "@dubbie/db";

interface LanguageSelectorProps {
  selectedLanguage: AcceptedLanguage | null;
  setSelectedLanguage: (value: AcceptedLanguage | null) => void;
}

export function LanguageSelector({
  selectedLanguage,
  setSelectedLanguage,
}: LanguageSelectorProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="text-sm opacity-50">Target Language</div>
      <Select
        onValueChange={(value) =>
          setSelectedLanguage(value as AcceptedLanguage)
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="font-medium opacity-50">
              Languages
            </SelectLabel>
            {LANGUAGES.map((option) => (
              <SelectItem key={option.label} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
