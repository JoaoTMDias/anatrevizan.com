import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LanguageOption {
	locale: string;
	label: string;
	flag: string;
	href: string;
}

export default function LanguageSelect({
	current,
	options,
	label,
}: {
	current: LanguageOption;
	options: LanguageOption[];
	label: string;
}) {
	if (options.length < 2) return null;
	return (
		<SelectPrimitive.Root
			value={current.locale}
			onValueChange={(value) => {
				const option = options.find((candidate) => candidate.locale === value);
				if (option) {
					const fragments: Record<string, string> = {
						"#agendar": "#book",
						"#book": "#agendar",
						"#mensagem": "#message",
						"#message": "#mensagem",
					};
					window.location.assign(
						`${option.href}${fragments[window.location.hash] ?? window.location.hash}`,
					);
				}
			}}
		>
			<SelectPrimitive.Trigger
				aria-label={label}
				className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-3 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
			>
				<span className="font-emoji" aria-hidden="true">
					{current.flag}
				</span>
				<SelectPrimitive.Value>{current.label}</SelectPrimitive.Value>
				<ChevronDownIcon className="size-4" aria-hidden="true" />
			</SelectPrimitive.Trigger>
			<SelectPrimitive.Portal>
				<SelectPrimitive.Positioner className="z-50">
					<SelectPrimitive.Popup className="min-w-56 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg">
						{options.map((option) => (
							<SelectPrimitive.Item
								key={option.locale}
								value={option.locale}
								className={cn(
									"flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-accent",
									option.locale === current.locale && "font-semibold",
								)}
							>
								<span className="font-emoji" aria-hidden="true">
									{option.flag}
								</span>
								<SelectPrimitive.ItemText>
									{option.label}
								</SelectPrimitive.ItemText>
								<SelectPrimitive.ItemIndicator className="ml-auto">
									<CheckIcon className="size-4" aria-hidden="true" />
								</SelectPrimitive.ItemIndicator>
							</SelectPrimitive.Item>
						))}
					</SelectPrimitive.Popup>
				</SelectPrimitive.Positioner>
			</SelectPrimitive.Portal>
		</SelectPrimitive.Root>
	);
}
