import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface HeaderMenuChild {
	description?: string;
	highlight?: boolean;
	href: string;
	isCurrent: boolean;
	label: string;
	tag?: string;
}

export interface HeaderMenuItem {
	children: HeaderMenuChild[];
	emphasis?: boolean;
	href: string;
	isCurrent: boolean;
	isCurrentSection: boolean;
	label: string;
	type: string;
}

interface LanguageLink {
	accessibleLabel: string;
	href: string;
	hreflang: string;
	label: string;
	lang: string;
	mobileLabel: string;
}

interface HeaderMenuProps {
	closeLabel: string;
	items: HeaderMenuItem[];
	languageLink?: LanguageLink;
	menuLabel: string;
}

export default function HeaderMenu({
	closeLabel,
	items,
	languageLink,
	menuLabel,
}: HeaderMenuProps) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const mobileTriggerRef = useRef<HTMLButtonElement>(null);
	const wasMobileOpenRef = useRef(false);
	useEffect(() => {
		if (mobileOpen) {
			wasMobileOpenRef.current = true;
			return;
		}
		if (!wasMobileOpenRef.current) return;
		wasMobileOpenRef.current = false;
		// Base UI completes its 200 ms exit transition and focus cleanup after
		// `open` changes. Restore focus once that lifecycle has settled.
		const focusTimer = window.setTimeout(
			() => mobileTriggerRef.current?.focus(),
			250,
		);
		return () => window.clearTimeout(focusTimer);
	}, [mobileOpen]);
	useEffect(() => {
		if (!mobileOpen) return;
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") setMobileOpen(false);
		};
		document.addEventListener("keydown", closeOnEscape);
		return () => document.removeEventListener("keydown", closeOnEscape);
	}, [mobileOpen]);
	const localizedLanguageHref = (href: string) => {
		if (typeof window === "undefined") return href;
		const fragments: Record<string, string> = {
			"#agendar": "#book",
			"#book": "#agendar",
		};
		return `${href}${fragments[window.location.hash] ?? ""}`;
	};

	return (
		<>
			<NavigationMenu className="hidden lg:flex">
				<NavigationMenuList className="justify-end gap-1">
					{items.map((item) => (
						<NavigationMenuItem
							key={item.href}
							className="header-menu__item"
							data-current={item.isCurrentSection ? "true" : undefined}
						>
							{item.type === "menu" && item.children.length > 0 ? (
								<>
									<NavigationMenuTrigger className="nav-menu__trigger">
										{item.label}
									</NavigationMenuTrigger>
									<NavigationMenuContent className="nav-dropdown header-menu__content w-[20rem]! max-w-[calc(100vw-3rem)]!">
										<ul>
											{item.children.map((child) => (
												<li key={child.href}>
													<NavigationMenuLink
														href={child.href}
														className={cn(
															"nav-dropdown__item grid! items-stretch! gap-[0.1875rem]! rounded-none!",
															child.highlight &&
																"nav-dropdown__item--highlight",
														)}
														aria-current={child.isCurrent ? "page" : undefined}
													>
														{child.tag && (
															<span className="nav-dropdown__tag">
																{child.tag}
															</span>
														)}
														<span className="nav-dropdown__title">
															{child.label}
														</span>
														{child.description && (
															<span className="nav-dropdown__description">
																{child.description}
															</span>
														)}
													</NavigationMenuLink>
												</li>
											))}
										</ul>
									</NavigationMenuContent>
								</>
							) : (
								<NavigationMenuLink
									href={item.href}
									className={cn(
										navigationMenuTriggerStyle(),
										"text-foreground/80 hover:text-primary",
										item.emphasis &&
											"ml-2 rounded-full bg-linear-to-br from-[color-mix(in_oklch,var(--action-primary),white_10%)] to-action-primary px-5 text-action-primary-foreground shadow-sm hover:from-[color-mix(in_oklch,var(--action-primary),black_10%)] hover:text-action-primary-foreground focus:text-action-primary-foreground active:text-action-primary-foreground",
									)}
									aria-current={item.isCurrent ? "page" : undefined}
								>
									{item.label}
								</NavigationMenuLink>
							)}
						</NavigationMenuItem>
					))}
					{languageLink && (
						<NavigationMenuItem>
							<NavigationMenuLink
								href={languageLink.href}
								className={navigationMenuTriggerStyle()}
								lang={languageLink.lang}
								hrefLang={languageLink.hreflang}
								aria-label={languageLink.accessibleLabel}
								onClick={(event) => {
									event.currentTarget.href = localizedLanguageHref(
										languageLink.href,
									);
								}}
							>
								{languageLink.label}
							</NavigationMenuLink>
						</NavigationMenuItem>
					)}
				</NavigationMenuList>
			</NavigationMenu>

			<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
				<SheetTrigger
					ref={mobileTriggerRef}
					className="header-menu-toggle grid size-11 cursor-pointer place-items-center rounded-full text-foreground lg:hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					aria-label={menuLabel}
				>
					<MenuIcon className="size-6" aria-hidden="true" />
				</SheetTrigger>
				<SheetContent
					side="right"
					showCloseButton={false}
					className="w-80! max-w-[85vw]! gap-0 overflow-y-auto bg-background p-5"
				>
					<SheetTitle className="sr-only">{menuLabel}</SheetTitle>
					<div className="mb-8 flex items-center justify-between gap-4">
						<SheetClose
							className="grid size-11 cursor-pointer place-items-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
							aria-label={closeLabel}
						>
							<XIcon className="size-6" aria-hidden="true" />
						</SheetClose>
					</div>
					<ul className="space-y-1">
						{items.map((item) => (
							<li key={item.href}>
								{item.type === "menu" && item.children.length > 0 ? (
									<Collapsible defaultOpen={item.isCurrentSection}>
										<CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-3 font-medium hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
											{item.label}
											<ChevronDownIcon
												className="size-4 transition-transform group-data-panel-open:rotate-180"
												aria-hidden="true"
											/>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<ul className="ml-3 border-l pl-3">
												{item.children.map((child) => (
													<li key={child.href}>
														<a
															href={child.href}
															onClick={() => setMobileOpen(false)}
															className="block rounded-md px-3 py-2 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
															aria-current={
																child.isCurrent ? "page" : undefined
															}
														>
															<span className="block font-medium">
																{child.label}
															</span>
															{child.description && (
																<span className="block text-xs text-muted-foreground">
																	{child.description}
																</span>
															)}
														</a>
													</li>
												))}
											</ul>
										</CollapsibleContent>
									</Collapsible>
								) : (
									<a
										href={item.href}
										onClick={() => setMobileOpen(false)}
										className={cn(
											"block rounded-md px-3 py-3 font-medium hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
											item.emphasis &&
												"rounded-full bg-action-primary px-5 text-action-primary-foreground hover:bg-action-primary/90 hover:text-action-primary-foreground focus:bg-action-primary focus:text-action-primary-foreground active:bg-action-primary active:text-action-primary-foreground",
										)}
										aria-current={item.isCurrent ? "page" : undefined}
									>
										{item.label}
									</a>
								)}
							</li>
						))}
					</ul>
					{languageLink && (
						<a
							className="mt-2 block border-t px-3 py-3"
							href={languageLink.href}
							lang={languageLink.lang}
							hrefLang={languageLink.hreflang}
							aria-label={languageLink.accessibleLabel}
							onClick={(event) => {
								event.currentTarget.href = localizedLanguageHref(
									languageLink.href,
								);
								setMobileOpen(false);
							}}
						>
							{languageLink.mobileLabel}
						</a>
					)}
				</SheetContent>
			</Sheet>
		</>
	);
}
