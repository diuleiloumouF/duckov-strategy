import { GraphNode, parseQuestName } from '../types/quest';

interface QuestListProps {
    quests: GraphNode[];
    searchTerm: string;
}

export default function QuestList({ quests, searchTerm }: QuestListProps) {
    // Filter quests based on search term
    const filteredQuests = quests.filter((quest) => {
        if (!searchTerm) return true;

        const parsed = parseQuestName(quest.name);
        const searchLower = searchTerm.toLowerCase();

        return (
            quest?.questID?.toString().includes(searchLower) ||
            parsed.title.toLowerCase().includes(searchLower) ||
            parsed.npc.toLowerCase().includes(searchLower) ||
            quest.comment.toLowerCase().includes(searchLower)
        );
    });

    const getColorBorder = (quest: GraphNode) => {
        if (!quest.color) return undefined;
        const { r, g, b } = quest.color;
        return `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
    };

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredQuests.length} of {quests.length} quests
            </div>

            {/* Quest List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuests.map((quest) => {
                    const parsed = parseQuestName(quest.name);
                    const borderColor = getColorBorder(quest);

                    return (
                        <div
                            key={`${quest.questID}-${quest.$id}`}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
                            style={
                                borderColor
                                    ? {
                                          borderLeftColor: borderColor,
                                          borderLeftWidth: '4px',
                                      }
                                    : {}
                            }
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                                            #{parsed.questId}
                                        </span>
                                        {quest.tag && (
                                            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                                                {quest.tag}
                                            </span>
                                        )}

                                        {parsed.unlock && (
                                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded text-xs">
                                                {parsed.unlock}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                        {parsed.title}
                                    </h3>
                                </div>
                            </div>

                            {/* NPC */}
                            {parsed.npc && (
                                <div className="mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        NPC:{' '}
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {parsed.npc}
                                        </span>
                                    </span>
                                </div>
                            )}

                            {/* Rewards */}
                            {parsed.rewards && (
                                <div className="mb-3">
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                        {parsed.rewards}
                                    </p>
                                </div>
                            )}

                            {/* Description */}
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                                {quest.comment}
                            </p>

                            {/* Type Badge */}
                            {quest.$type.includes('Proxy') && (
                                <div className="mt-3">
                                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                        Proxy Quest
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* No Results */}
            {filteredQuests.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                        No quests found matching {searchTerm}
                    </p>
                </div>
            )}
        </div>
    );
}
