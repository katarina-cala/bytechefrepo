import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {ComponentDefinitionBasic, TaskDispatcherDefinition} from '@/shared/middleware/platform/configuration';
import {useFeatureFlagsStore} from '@/shared/stores/useFeatureFlagsStore';
import {ClickedDefinitionType} from '@/shared/types';
import {BotIcon, ListFilterIcon, PlusIcon, SearchIcon, SparkleIcon} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {twMerge} from 'tailwind-merge';

import WorkflowNodesTabsItem from './WorkflowNodesTabsItem';

type DefinitionType = (ComponentDefinitionBasic | TaskDispatcherDefinition) & {
    taskDispatcher: boolean;
    trigger: boolean;
};

interface WorkflowNodesTabsProps {
    actionComponentDefinitions: Array<ComponentDefinitionBasic>;
    hideActionComponents?: boolean;
    hideTaskDispatchers?: boolean;
    hideTriggerComponents?: boolean;
    itemsDraggable?: boolean;
    onItemClick?: (clickedItem: ClickedDefinitionType) => void;
    selectedComponentName?: string;
    taskDispatcherDefinitions: Array<TaskDispatcherDefinition>;
    triggerComponentDefinitions: Array<ComponentDefinitionBasic>;
}

const WorkflowNodesTabs = ({
    actionComponentDefinitions,
    hideActionComponents = false,
    hideTaskDispatchers = false,
    hideTriggerComponents = false,
    itemsDraggable = false,
    onItemClick,
    selectedComponentName,
    taskDispatcherDefinitions,
    triggerComponentDefinitions,
}: WorkflowNodesTabsProps) => {
    const [activeTab, setActiveTab] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [selectedFilterCategories, setSelectedFilterCategories] = useState<string[]>([]);
    const [filteredCount, setFilteredCount] = useState(0);
    const [savedFilterCategories, setSavedFilterCategories] = useState<string[]>([]);
    const [activeView, setActiveView] = useState('all');

    const ff_1057 = useFeatureFlagsStore()('ff-1057');

    const defaultTabValue = useMemo(() => {
        if (!hideTriggerComponents) {
            return 'triggers';
        } else {
            return 'components';
        }
    }, [hideTriggerComponents]);

    const availableTriggers = useMemo(() => {
        return triggerComponentDefinitions.map(
            (triggerDefinition) =>
                ({
                    ...triggerDefinition,
                    trigger: true,
                }) as DefinitionType
        );
    }, [triggerComponentDefinitions]);

    const availableTaskDispatchers = useMemo(() => {
        let availableTaskDispatchers;

        if (ff_1057) {
            availableTaskDispatchers = taskDispatcherDefinitions;
        } else {
            availableTaskDispatchers = taskDispatcherDefinitions.filter(
                (taskDispatcherDefinition) => taskDispatcherDefinition.name === 'condition'
            );
        }

        return availableTaskDispatchers.map(
            (dispatcher) =>
                ({
                    ...dispatcher,
                    taskDispatcher: true,
                }) as DefinitionType
        );
    }, [ff_1057, taskDispatcherDefinitions]);

    const categoryIconName: Record<string, JSX.Element> = useMemo(
        () => ({
            accounting: <SparkleIcon />,
            'artificial-intelligence': <SparkleIcon />,
            'calendars-and-scheduling': <SparkleIcon />,
            communication: <SparkleIcon />,
            crm: <SparkleIcon />,
            'customer-support': <SparkleIcon />,
            'developer-tools': <SparkleIcon />,
            'e-commerce': <SparkleIcon />,
            'file-storage': <SparkleIcon />,
            helpers: <SparkleIcon />,
            'marketing-automation': <SparkleIcon />,
            'payment-processing': <SparkleIcon />,
            'productivity-and-collaboration': <SparkleIcon />,
            'project-management': <SparkleIcon />,
            'surveys-and-feedback': <SparkleIcon />,
        }),
        []
    );

    //unique categories for action components (puni array sa svim UNIQUE kategorijama koje postoje u action components kako bi dobili listu svih mogucih kategorija)
    const uniqueActionComponentCategories = useMemo(() => {
        return actionComponentDefinitions?.reduce(
            (accumulator, currentComponentDefinition) => {
                if (currentComponentDefinition.componentCategories) {
                    currentComponentDefinition.componentCategories.forEach((currentCategory) => {
                        const categoryLabel = currentCategory.label;

                        if (categoryLabel) {
                            if (!accumulator.some((item) => item.label === categoryLabel)) {
                                accumulator.push({
                                    icon: categoryIconName[categoryLabel.toLowerCase()] || null,
                                    label: categoryLabel,
                                });
                            }
                        }
                    });
                }

                return accumulator;
            },
            [] as Array<{label: string; icon: JSX.Element | null}>
        );
    }, [actionComponentDefinitions, categoryIconName]);

    //filter unique categories based on search value (puni array sa kategorijama koje dobijemo priko searcha unutar dropdowna)
    const filteredUniqueActionComponentCategories = useMemo(() => {
        return uniqueActionComponentCategories.filter((category) =>
            category.label.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [searchValue, uniqueActionComponentCategories]);

    //toggle category filter (puni array selektiranih kategorija, ako kategorija koju odaberes ne postoji u arrayu onda ce je dodat u array a ako postoji onda ce je maknit iz array-a / pokriva da klik na category1 doda category1  a ponovni klik na category1 makne category1 iz selektiranih)
    const handleCategorySelectToggle = (category: string) => {
        if (!selectedFilterCategories.includes(category)) {
            setSelectedFilterCategories([...selectedFilterCategories, category]);
        } else {
            setSelectedFilterCategories(selectedFilterCategories.filter((item) => item !== category));
        }

        setActiveView('filtered');
    };

    //filter action components based on selected categories (puni array sa action components koje sadrze one kategorije koje su selektirane unutar dropdowna / usporeduje selectedFilterCategories sa componentCategories)
    const filteredActionComponents = useMemo(() => {
        const getFilteredActionComponents = (
            actionComponentDefinitions: ComponentDefinitionBasic[] | undefined,
            selectedFilterCategories: string[]
        ) => {
            if (!actionComponentDefinitions) {
                return [];
            }

            //ako je active view "all" onda se prikazuju sve komponente
            if (activeView === 'all') {
                return actionComponentDefinitions;
            }

            //ako se maknu sve selektirane kategorije priko dropdowna, onda se svi stateovi resetiraju na pocetne i prikazuju se sve komponente i active view je "all"
            if (selectedFilterCategories.length === 0) {
                setFilteredCount(0);
                setSavedFilterCategories([]);
                setActiveView('all');

                return actionComponentDefinitions;
            }

            return [...actionComponentDefinitions].filter((componentDefinition) => {
                const componentCategoryLabels =
                    componentDefinition.componentCategories?.map((category) => category.label?.toLowerCase() || '') ||
                    [];

                return selectedFilterCategories.some((filterCategory) =>
                    componentCategoryLabels.includes(filterCategory.toLowerCase())
                );
            });
        };

        return getFilteredActionComponents(actionComponentDefinitions, selectedFilterCategories);
    }, [actionComponentDefinitions, activeView, selectedFilterCategories]);

    // console.log('filteredCount', filteredCount);
    // console.log('savedFilterCategories', savedFilterCategories);
    // console.log('selectedFilterCategories', selectedFilterCategories);
    // console.log('filteredActionComponents', filteredActionComponents);
    // console.log('actionComponentDefinitions', actionComponentDefinitions);
    // console.log('activeTab', activeTab);
    // console.log('hideActionComponents', hideActionComponents);
    // console.log('hideTaskDispatchers', hideTaskDispatchers);
    // console.log('hideTriggerComponents', hideTriggerComponents);

    useEffect(() => {
        if (!hideTriggerComponents) {
            setActiveTab('triggers');
        } else {
            setActiveTab('components');
        }
    }, [hideTriggerComponents]);

    return (
        <Tabs
            className="flex h-full flex-col"
            // defaultValue={defaultTabValue}
            onValueChange={setActiveTab}
            value={activeTab}
        >
            <div className="px-3">
                <TabsList className="mt-2 flex w-full justify-between">
                    {!hideTriggerComponents && (
                        <TabsTrigger className="w-full data-[state=active]:shadow-none" value="triggers">
                            Triggers
                        </TabsTrigger>
                    )}

                    {!hideActionComponents && (
                        <TabsTrigger className="w-full data-[state=active]:shadow-none" value="components">
                            Actions
                        </TabsTrigger>
                    )}

                    {!hideTaskDispatchers && (
                        <TabsTrigger className="w-full data-[state=active]:shadow-none" value="taskDispatchers">
                            Flows
                        </TabsTrigger>
                    )}
                </TabsList>
            </div>

            {activeTab === 'components' && !hideActionComponents && (
                <div className="flex justify-between px-3 py-2">
                    <div>
                        <Button
                            className={twMerge(
                                'bg-trasnparent border-none text-xs text-content-neutral-secondary shadow-none hover:bg-transparent hover:text-content-neutral-primary',
                                activeView === 'all' &&
                                    'bg-surface-brand-secondary text-content-brand-primary hover:bg-surface-brand-secondary hover:text-content-brand-primary'
                            )}
                            onClick={() => {
                                if (selectedFilterCategories.length > 0) {
                                    setSavedFilterCategories(selectedFilterCategories);
                                    setFilteredCount(filteredActionComponents.length);
                                }

                                setActiveView('all');
                            }}
                        >
                            <span>All</span>

                            <div className="rounded-md bg-background px-2 py-1">
                                {actionComponentDefinitions.length}
                            </div>
                        </Button>

                        <Button
                            className={twMerge(
                                'bg-trasnparent border-none text-xs text-content-neutral-secondary shadow-none hover:bg-transparent hover:text-content-neutral-primary',
                                activeView === 'filtered' &&
                                    'bg-surface-brand-secondary text-content-brand-primary hover:bg-surface-brand-secondary hover:text-content-brand-primary',
                                selectedFilterCategories.length > 0 ? 'visible' : 'invisible'
                            )}
                            onClick={() => {
                                if (savedFilterCategories.length > 0) {
                                    setSelectedFilterCategories(savedFilterCategories);
                                }
                                setActiveView('filtered');
                            }}
                            variant={activeView === 'filtered' ? 'default' : 'ghost'}
                        >
                            <span>Filtered</span>

                            <div className="rounded-md bg-background px-2 py-1">
                                {activeView === 'filtered' ? filteredActionComponents.length : filteredCount}
                            </div>
                        </Button>
                    </div>

                    <DropdownMenu>
                        <Tooltip>
                            <DropdownMenuTrigger asChild>
                                <TooltipTrigger asChild>
                                    <Button
                                        aria-label="Sort by"
                                        className="border-none bg-transparent p-2 text-content-neutral-secondary shadow-none hover:bg-transparent hover:text-content-neutral-primary data-[state=open]:bg-surface-brand-secondary data-[state=open]:text-content-brand-primary"
                                        size="icon"
                                        variant="outline"
                                    >
                                        <ListFilterIcon />
                                    </Button>
                                </TooltipTrigger>
                            </DropdownMenuTrigger>

                            <TooltipContent>Filter actions by category</TooltipContent>
                        </Tooltip>

                        <DropdownMenuContent align="end" className="overflow-hidden p-0">
                            <div className="relative w-full rounded-md bg-background p-1">
                                <SearchIcon className="absolute left-3 top-3.5 size-4 text-muted-foreground" />

                                <Input
                                    className="pl-8 text-sm"
                                    onChange={(event) => setSearchValue(event.target.value)}
                                    onKeyDown={(event) => {
                                        event.stopPropagation();
                                    }}
                                    placeholder="Find category"
                                    value={searchValue}
                                />
                            </div>

                            <ScrollArea className="h-56 overflow-y-auto">
                                {filteredUniqueActionComponentCategories.map((category) => (
                                    <DropdownMenuCheckboxItem
                                        checked={selectedFilterCategories.includes(category.label)}
                                        className="flex cursor-pointer items-center justify-between gap-5 rounded-none pl-3 pr-3 hover:bg-surface-neutral-primary-hover [&>span:first-child]:static [&>span:first-child]:order-last"
                                        key={category.label}
                                        onCheckedChange={() => handleCategorySelectToggle(category.label)}
                                        onSelect={(event) => event.preventDefault()}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="[&>svg]:size-4">
                                                {category.icon ? category.icon : <BotIcon />}
                                            </span>

                                            <span>{category.label}</span>
                                        </div>
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            {!hideTriggerComponents && (
                <ScrollArea className="overflow-y-auto px-3">
                    <TabsContent className="mt-0 w-full flex-1" value="triggers">
                        <ul className="space-y-2" role="list">
                            {!triggerComponentDefinitions.length && (
                                <span className="block px-3 py-2 text-xs text-content-neutral-secondary">
                                    No trigger components found.
                                </span>
                            )}

                            {availableTriggers.map((triggerDefinition) => (
                                <WorkflowNodesTabsItem
                                    draggable={itemsDraggable}
                                    handleClick={() =>
                                        onItemClick && onItemClick(triggerDefinition as ClickedDefinitionType)
                                    }
                                    key={triggerDefinition.name}
                                    node={triggerDefinition as DefinitionType}
                                />
                            ))}
                        </ul>
                    </TabsContent>
                </ScrollArea>
            )}

            {!hideActionComponents && (
                <ScrollArea className="overflow-y-auto px-3">
                    <TabsContent className="mt-0 w-full flex-1" value="components">
                        <ul className="space-y-2" role="list">
                            {!actionComponentDefinitions.length && (
                                <span className="block px-3 py-2 text-xs text-content-neutral-secondary">
                                    No action components found.
                                </span>
                            )}

                            {filteredActionComponents?.map((componentDefinition) => (
                                <WorkflowNodesTabsItem
                                    draggable={itemsDraggable}
                                    handleClick={() =>
                                        onItemClick && onItemClick(componentDefinition as ClickedDefinitionType)
                                    }
                                    key={componentDefinition.name}
                                    node={componentDefinition as DefinitionType}
                                    selected={selectedComponentName === componentDefinition.name}
                                />
                            ))}
                        </ul>
                    </TabsContent>
                </ScrollArea>
            )}

            {!hideTaskDispatchers && (
                <ScrollArea className="overflow-y-auto px-3">
                    <TabsContent className="mt-0 w-full flex-1" value="taskDispatchers">
                        <ul className="space-y-2" role="list">
                            {!taskDispatcherDefinitions.length && (
                                <span className="block px-3 py-2 text-xs text-content-neutral-secondary">
                                    No flow controls found.
                                </span>
                            )}

                            {availableTaskDispatchers.map((taskDispatcherDefinition) => (
                                <WorkflowNodesTabsItem
                                    draggable={itemsDraggable}
                                    handleClick={() =>
                                        onItemClick && onItemClick(taskDispatcherDefinition as ClickedDefinitionType)
                                    }
                                    key={taskDispatcherDefinition.name}
                                    node={taskDispatcherDefinition as DefinitionType}
                                />
                            ))}
                        </ul>
                    </TabsContent>
                </ScrollArea>
            )}
        </Tabs>
    );
};

export default WorkflowNodesTabs;
