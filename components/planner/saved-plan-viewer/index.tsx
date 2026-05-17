import React, { useState, useEffect, useMemo, createElement } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Typography } from '@/constants/theme';
import { NorthHeader } from '@/components/ui/north-header';
import { dbService, SavedPlanRecord } from '@/database';
import { TripItinerary, ItineraryDay, ItineraryNode, DayNote } from '../itinerary/types';
import { createStyles } from './saved-plan-viewer.styles';
import { formatTime, recalculatePlanFuelCosts } from '../itinerary/itinerary.service';
import { Slider } from '@/components/ui/slider';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function SlidingText({ text, style }: { text: string; style?: any }) {
  const [textWidth, setTextWidth] = useState(0);
  const [containerActualWidth, setContainerActualWidth] = useState(200);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animatedValue.setValue(0);
    
    if (textWidth > containerActualWidth) {
      const scrollRange = textWidth - containerActualWidth;
      const duration = scrollRange * 40; // speed proportional to distance
      
      const animation = Animated.loop(
        Animated.sequence([
          Animated.delay(2000), // Hold at the beginning
          Animated.timing(animatedValue, {
            toValue: -scrollRange - 20,
            duration: Math.max(3000, duration),
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.delay(1500), // Hold at the end
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1200, // Slide back smoothly
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [text, textWidth, containerActualWidth]);

  return (
    <View 
      style={{ overflow: 'hidden', width: '100%', alignItems: 'center', justifyContent: 'center' }}
      onLayout={(e) => setContainerActualWidth(e.nativeEvent.layout.width)}
    >
      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
        <Animated.Text
          numberOfLines={1}
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
          style={[
            style,
            {
              transform: [{ translateX: animatedValue }],
              whiteSpace: 'nowrap', // For web support
            }
          ]}
        >
          {text}
        </Animated.Text>
      </View>
    </View>
  );
}

// ── Inline calendar for web (no native picker available) ──────────────────────
function WebCalendar({
  value,
  onChange,
  onClose,
  colorScheme,
}: {
  value: Date;
  onChange: (d: Date) => void;
  onClose: () => void;
  colorScheme: 'light' | 'dark';
}) {
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());

  const bg = colorScheme === 'dark' ? '#052e16' : '#ffffff';
  const fg = colorScheme === 'dark' ? '#ffffff' : '#111827';
  const accent = '#2e8b58';
  const subtle = colorScheme === 'dark' ? '#166534' : '#e5e7eb';
  const today = new Date();

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isPast = (d: number) => {
    const dt = new Date(viewYear, viewMonth, d);
    dt.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return dt < t;
  };
  const isSelected = (d: number) =>
    value.getDate() === d && value.getMonth() === viewMonth && value.getFullYear() === viewYear;

  return (
    <View style={{ backgroundColor: bg, borderRadius: 20, padding: 16, width: 320 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <TouchableOpacity onPress={prevMonth} style={{ padding: 8 }}>
          <Text style={{ color: accent, fontSize: 20, fontWeight: '700' }}>‹</Text>
        </TouchableOpacity>
        <Text style={{ color: fg, fontWeight: '700', fontSize: 16 }}>{monthName}</Text>
        <TouchableOpacity onPress={nextMonth} style={{ padding: 8 }}>
          <Text style={{ color: accent, fontSize: 20, fontWeight: '700' }}>›</Text>
        </TouchableOpacity>
      </View>
      {/* Day labels */}
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <View key={d} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: accent, fontSize: 12, fontWeight: '700' }}>{d}</Text>
          </View>
        ))}
      </View>
      {/* Days grid */}
      <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
        {cells.map((day, i) => (
          <View key={i} style={{ width: `${100/7}%`, alignItems: 'center', marginBottom: 4 }}>
            {day !== null ? (
              <TouchableOpacity
                disabled={isPast(day)}
                onPress={() => {
                  onChange(new Date(viewYear, viewMonth, day));
                  onClose();
                }}
                style={{
                  width: 36, height: 36, borderRadius: 18,
                  backgroundColor: isSelected(day) ? accent : 'transparent',
                  justifyContent: 'center', alignItems: 'center',
                }}
              >
                <Text style={{
                  color: isPast(day) ? (colorScheme === 'dark' ? '#4b5563' : '#d1d5db')
                    : isSelected(day) ? '#ffffff' : fg,
                  fontWeight: isSelected(day) ? '700' : '400',
                  fontSize: 14,
                }}>{day}</Text>
              </TouchableOpacity>
            ) : <View style={{ width: 36, height: 36 }} />}
          </View>
        ))}
      </View>
      {/* Close */}
      <TouchableOpacity
        onPress={onClose}
        style={{ marginTop: 12, alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: subtle }}
      >
        <Text style={{ color: accent, fontWeight: '700', fontSize: 15 }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

interface Props {
  planId: string;
  onBack: () => void;
}

export default function SavedPlanViewerComponent({ planId, onBack }: Props) {
  const colorScheme = useColorScheme();
  const styles = useMemo(() => createStyles(colorScheme ?? 'light'), [colorScheme]);
  const theme = Colors[colorScheme ?? 'light'];
  const formatDateString = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    try {
      // Split YYYY-MM-DD to avoid timezone shifts
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
        }
      }
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const getDaysToGo = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      let tripDate: Date;
      if (parts.length === 3) {
        tripDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        tripDate = new Date(dateStr);
      }
      tripDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = tripDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Tomorrow';
      } else if (diffDays > 1) {
        return `${diffDays} Days to go`;
      } else if (diffDays === -1) {
        return 'Yesterday';
      } else {
        return `${Math.abs(diffDays)} Days ago`;
      }
    } catch {
      return '';
    }
  };

  const [record, setRecord] = useState<SavedPlanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFloatingCost, setShowFloatingCost] = useState(false);
  const costBarAnim = React.useRef(new Animated.Value(0)).current;

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const shouldShow = y > 240;
    if (shouldShow !== showFloatingCost) {
      setShowFloatingCost(shouldShow);
      Animated.timing(costBarAnim, {
        toValue: shouldShow ? 1 : 0,
        duration: 350,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: true,
      }).start();
    }
  };

  const formatCompactCost = (value: number): string => {
    if (value >= 100000) {
      const lacs = value / 100000;
      const formatted = lacs % 1 === 0 ? lacs.toFixed(0) : parseFloat(lacs.toFixed(2)).toString();
      return `${formatted} lac${lacs > 1 ? 's' : ''}`;
    } else if (value >= 1000) {
      const k = value / 1000;
      const formatted = k % 1 === 0 ? k.toFixed(0) : parseFloat(k.toFixed(2)).toString();
      return `${formatted}K`;
    }
    return value.toString();
  };
  
  // Modals state
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [isTripNote, setIsTripNote] = useState(false);
  
  // Note Form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Activity Form
  const [actName, setActName] = useState('');
  const [actDuration, setActDuration] = useState('1 hr');
  const [actCost, setActCost] = useState('');
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

  // Itinerary UI State
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});
  const [menuConfig, setMenuConfig] = useState<{ dayId: string; groupId: string; x: number; y: number } | null>(null);
  const [activeSliderDayId, setActiveSliderDayId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ 
    type: 'note' | 'activity', 
    dayId: string | null, 
    id: string, 
    isTrip?: boolean, 
    cost?: number 
  } | null>(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [todosCollapsed, setTodosCollapsed] = useState(false);

  useEffect(() => {
    loadPlan();
  }, [planId]);

  const loadPlan = async () => {
    setLoading(true);
    const plan = await dbService.getPlanById(planId);
    if (plan) {
      const { updatedPlan, totalCost } = recalculatePlanFuelCosts(plan.data);
      const updatedRecord: SavedPlanRecord = {
        ...plan,
        data: updatedPlan,
        totalCost: totalCost
      };
      setRecord(updatedRecord);
      
      const initialCollapsed: Record<string, boolean> = {};
      updatedPlan.days.forEach((day: ItineraryDay, index: number) => {
        initialCollapsed[day.id] = index !== 0;
      });
      setCollapsedDays(initialCollapsed);
    } else {
      setRecord(null);
    }
    setLoading(false);
  };

  const saveChanges = async (updatedPlan: TripItinerary, updatedTotalCost?: number, updatedStartDate?: string) => {
    if (!record) return;
    try {
      await dbService.updatePlan(updatedPlan, updatedTotalCost ?? record.totalCost);
      // Use functional update to ensure we have latest record
      setRecord(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          data: updatedPlan, 
          totalCost: updatedTotalCost ?? prev.totalCost,
          startDate: updatedStartDate ?? prev.startDate
        };
      });

      // Show temporary "Saved" feedback
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowSavedMessage(true);
      setTimeout(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowSavedMessage(false);
      }, 2000);
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  // --- Logic from ItineraryComponent ---
  const toggleDay = (dayId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const recalculateDayTimes = (day: ItineraryDay): ItineraryDay => {
    let currentMin = day.departureTimeMin;
    
    const newNodes = day.nodes.map(node => {
      if (node.type === 'ActivityGroup') {
        const groupStartTime = formatTime(currentMin);
        const newItems = node.items?.map(item => {
          const itemNode = { 
            ...item, 
            time: formatTime(currentMin),
            arrivalTime: formatTime(currentMin + (item.timeRequiredMin || 0))
          };
          if (item.isSelected && !item.isHidden) {
            currentMin += item.timeRequiredMin || 0;
          }
          return itemNode;
        });
        return {
          ...node,
          time: groupStartTime,
          items: newItems,
        };
      } else {
        const newNode = { 
          ...node, 
          time: formatTime(currentMin),
          arrivalTime: formatTime(currentMin + (node.timeRequiredMin || 0))
        };
        // Add duration of custom activities too if timeRequiredMin is set, otherwise default to 60 for calculation
        const durationMin = node.timeRequiredMin || (node.isCustom ? 60 : 0);
        if (node.isSelected && !node.isHidden) {
          currentMin += durationMin;
        }
        return newNode;
      }
    });

    return { ...day, nodes: newNodes };
  };

  const setDepartureTime = (dayId: string, timeMin: number) => {
    if (!record) return;
    const updatedData = { 
      ...record.data,
      days: record.data.days.map(day => {
        if (day.id !== dayId) return day;
        const updatedDay = { ...day, departureTimeMin: timeMin };
        return recalculateDayTimes(updatedDay);
      })
    };
    saveChanges(updatedData);
  };

  const toggleSubItem = (dayId: string, groupId: string, itemId: string) => {
    if (!record) return;
    
    const updatedData = { ...record.data };
    let costDiff = 0;

    updatedData.days = updatedData.days.map(day => {
      if (day.id !== dayId) return day;
      const updatedDay = {
        ...day,
        nodes: day.nodes.map(node => {
          if (node.id !== groupId || !node.items) return node;
          return {
            ...node,
            items: node.items.map(item => {
              if (item.id !== itemId) return item;
              const newIsSelected = !item.isSelected;
              if (newIsSelected) costDiff += item.cost;
              else costDiff -= item.cost;
              return { ...item, isSelected: newIsSelected };
            })
          };
        })
      };
      return recalculateDayTimes(updatedDay);
    });

    saveChanges(updatedData, record.totalCost + costDiff);
  };

  const hideSubItem = (dayId: string, groupId: string, itemId: string) => {
    if (!record) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedData = { ...record.data };
    
    updatedData.days = updatedData.days.map(day => {
      if (day.id !== dayId) return day;
      const updatedDay = {
        ...day,
        nodes: day.nodes.map(node => {
          if (node.id !== groupId || !node.items) return node;
          return {
            ...node,
            items: node.items.map(item => {
              if (item.id !== itemId) return item;
              return { ...item, isHidden: true, isSelected: false };
            })
          };
        })
      };
      return recalculateDayTimes(updatedDay);
    });
    
    saveChanges(updatedData);
  };

  const resetActivityGroup = (dayId: string, groupId: string) => {
    if (!record) return;
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedData = { ...record.data };
    // Cost diff recalculation would ideally happen by comparing old and new selected items
    // For simplicity, we just recalculate full cost later
    
    updatedData.days = updatedData.days.map(day => {
      if (day.id !== dayId) return day;
      const updatedDay = {
        ...day,
        nodes: day.nodes.map(node => {
          if (node.id !== groupId || !node.originalItems) return node;
          return {
            ...node,
            items: JSON.parse(JSON.stringify(node.originalItems))
          };
        })
      };
      return recalculateDayTimes(updatedDay);
    });
    
    saveChanges(updatedData); // Cost will need a full recalculate function if we reset
    setMenuConfig(null);
  };

  const openMenu = (dayId: string, groupId: string, event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    
    setMenuConfig({ 
      dayId, 
      groupId, 
      x: pageX - 130,
      y: pageY + 10 
    });
  };

  // --- End Logic from ItineraryComponent ---

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS, close on Android
    if (selectedDate && record) {
      // Format to YYYY-MM-DD
      const dateString = selectedDate.toISOString().split('T')[0];
      const updatedData = { ...record.data };
      if (updatedData.days.length > 0) {
        updatedData.days[0].date = dateString;
      }
      saveChanges(updatedData, record.totalCost, dateString);
    }
  };

  // --- Notes ---
  const toggleTodoCompletion = (todoId: string) => {
    if (!record) return;
    const updatedData = { ...record.data };
    const notes = updatedData.tripNotes ? [...updatedData.tripNotes] : [];
    const nIdx = notes.findIndex(n => n.id === todoId);
    if (nIdx > -1) {
      notes[nIdx] = { ...notes[nIdx], completed: !notes[nIdx].completed };
    }
    updatedData.tripNotes = notes;
    saveChanges(updatedData);
  };

  const openNoteModal = (dayId: string | null, isTrip: boolean, note?: DayNote) => {
    setActiveDayId(dayId);
    setIsTripNote(isTrip);
    if (note) {
      setNoteTitle(note.title);
      setNoteText(note.text);
      setEditingNoteId(note.id);
    } else {
      setNoteTitle('');
      setNoteText('');
      setEditingNoteId(null);
    }
    setNoteModalVisible(true);
  };

  const saveNote = () => {
    if (!record || !noteTitle) return;
    
    const updatedData = { ...record.data };

    if (isTripNote) {
      const notes = updatedData.tripNotes ? [...updatedData.tripNotes] : [];
      if (editingNoteId) {
        const nIdx = notes.findIndex(n => n.id === editingNoteId);
        if (nIdx > -1) {
          notes[nIdx] = { ...notes[nIdx], title: noteTitle, text: noteText };
        }
      } else {
        notes.push({ id: Math.random().toString(), title: noteTitle, text: noteText });
      }
      updatedData.tripNotes = notes;
    } else {
      if (!activeDayId) return;
      updatedData.days = updatedData.days.map(day => {
        if (day.id !== activeDayId) return day;
        const notes = day.notes ? [...day.notes] : [];
        if (editingNoteId) {
          const nIdx = notes.findIndex(n => n.id === editingNoteId);
          if (nIdx > -1) {
            notes[nIdx] = { ...notes[nIdx], title: noteTitle, text: noteText };
          }
        } else {
          notes.push({ id: Math.random().toString(), title: noteTitle, text: noteText });
        }
        return { ...day, notes };
      });
    }

    saveChanges(updatedData);
    setNoteModalVisible(false);
  };

  const performNoteDeletion = (dayId: string | null, isTrip: boolean, noteId: string) => {
    if (!record) return;
    const updatedData = { ...record.data };

    if (isTrip) {
      updatedData.tripNotes = updatedData.tripNotes?.filter(n => n.id !== noteId);
    } else {
      if (!dayId) return;
      updatedData.days = updatedData.days.map(day => {
        if (day.id !== dayId) return day;
        return { ...day, notes: day.notes?.filter(n => n.id !== noteId) };
      });
    }
    
    saveChanges(updatedData);
  };

  // --- Custom Activities ---
  const openActivityModal = (dayId: string, node?: ItineraryNode) => {
    setActiveDayId(dayId);
    if (node) {
      setActName(node.title);
      setActDuration(node.duration);
      setActCost(node.cost.toString());
      setEditingActivityId(node.id);
    } else {
      setActName('');
      setActDuration('1 hr');
      setActCost('0');
      setEditingActivityId(null);
    }
    setActivityModalVisible(true);
  };

  const saveActivity = () => {
    if (!record || !activeDayId || !actName) return;
    
    const costNum = parseFloat(actCost) || 0;
    let oldCost = 0;
    
    // Convert duration string to mins roughly for timeline recalculation
    let timeRequiredMin = 60;
    if (actDuration.toLowerCase().includes('hr') || actDuration.toLowerCase().includes('hour')) {
      const match = actDuration.match(/([\d.]+)/);
      if (match) timeRequiredMin = parseFloat(match[1]) * 60;
    } else if (actDuration.toLowerCase().includes('min')) {
      const match = actDuration.match(/([\d.]+)/);
      if (match) timeRequiredMin = parseFloat(match[1]);
    }
    
    const updatedData = {
      ...record.data,
      days: record.data.days.map(day => {
        if (day.id !== activeDayId) return day;
        
        let newNodes = [...day.nodes];
        if (editingActivityId) {
          const nodeIdx = newNodes.findIndex(n => n.id === editingActivityId);
          if (nodeIdx > -1) {
            oldCost = newNodes[nodeIdx].cost;
            newNodes[nodeIdx] = {
              ...newNodes[nodeIdx],
              title: actName,
              duration: actDuration,
              cost: costNum,
              timeRequiredMin
            };
          }
        } else {
          const newNode: ItineraryNode = {
            id: 'custom-' + Math.random().toString(),
            type: 'Activity',
            title: actName,
            description: 'Custom added activity',
            time: '--:--', 
            duration: actDuration,
            cost: costNum,
            timeRequiredMin,
            isFixed: false,
            isOptional: false,
            isSelected: true,
            isCustom: true
          };
          newNodes.push(newNode);
        }
        
        return recalculateDayTimes({ ...day, nodes: newNodes });
      })
    };

    const newTotalCost = record.totalCost - oldCost + costNum;
    saveChanges(updatedData, newTotalCost);
    setActivityModalVisible(false);
  };

  const performActivityDeletion = (dayId: string, nodeId: string, cost: number) => {
    if (!record) return;
    const updatedData = { 
      ...record.data,
      days: record.data.days.map(day => {
        if (day.id !== dayId) return day;
        const updatedDay = {
          ...day,
          nodes: day.nodes.filter(n => n.id !== nodeId)
        };
        return recalculateDayTimes(updatedDay);
      })
    };
    const newTotalCost = Math.max(0, record.totalCost - cost);
    saveChanges(updatedData, newTotalCost);
  };

  const renderNode = (dayId: string, node: ItineraryNode) => {
    const isActivity = node.type === 'Activity' || node.type === 'Stop' || node.type === 'Rest';
    
    return (
      <TouchableOpacity 
        key={node.id} 
        style={[
          styles.mustHaveCard, 
          isActivity ? styles.activityCard : styles.travelCard
        ]}
        onPress={() => isActivity && openActivityModal(dayId, node)}
        activeOpacity={isActivity ? 0.7 : 1}
      >
        <View style={styles.cardHeader}>
          <View style={styles.timeTag}>
            <Text style={styles.timeText}>{node.time}</Text>
          </View>
          <Text style={styles.durationText}>{node.duration}</Text>
        </View>
        
        <View style={styles.cardTitleRow}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {node.isCustom && (
              <View style={styles.customBadge}>
                <Text style={styles.customBadgeText}>CUSTOM</Text>
              </View>
            )}
            <Text style={styles.cardTitle} numberOfLines={2}>{node.title}</Text>
          </View>
        </View>

        {node.summary && <Text style={styles.cardSummary}>{node.summary}</Text>}
        {node.type === 'Travel' && node.arrivalTime && node.toLocation && (
          <Text style={styles.arrivalNote}>
            You will arrive at {node.toLocation} at {node.arrivalTime}
          </Text>
        )}
        {node.cost > 0 && node.type !== 'Travel' && (
          <Text style={[styles.durationText, { color: theme.accent, fontWeight: '700', marginTop: 4 }]}>
            Cost: PKR {node.cost.toLocaleString()}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderOptionalItem = (dayId: string, groupId: string, node: ItineraryNode) => {
    if (node.isHidden) return null;

    return (
      <View
        key={node.id}
        style={[styles.optionalCard, node.isSelected && styles.optionalCardSelected]}
      >
        <View style={styles.optionalInfo}>
          <Text style={styles.optionalTitle}>{node.title}</Text>
          <Text style={styles.optionalDetails}>{node.time} • {node.duration}</Text>
          {node.cost > 0 && (
            <Text style={[styles.optionalDetails, { color: theme.accent, fontWeight: '700' }]}>
              Cost: PKR {node.cost.toLocaleString()}
            </Text>
          )}
        </View>
        <View style={styles.activityActions}>
          <TouchableOpacity 
            style={[styles.addButton, node.isSelected && styles.addedButton]}
            onPress={() => toggleSubItem(dayId, groupId, node.id)}
          >
            <Text style={node.isSelected ? styles.addedButtonText : styles.addButtonText}>
              {node.isSelected ? 'Added' : 'Add'}
            </Text>
          </TouchableOpacity>
          
          {!node.isSelected && (
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => hideSubItem(dayId, groupId, node.id)}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading || !record) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NorthHeader 
        title={
          <SlidingText 
            text={record.title || "Saved Plan"} 
            style={{
              fontFamily: Typography.header.bold,
              fontSize: 18,
              color: '#ffffff',
              textAlign: 'center',
            }} 
          />
        }
        showLogo={false}
        leftElement={
          <TouchableOpacity style={styles.headerBtn} onPress={onBack}>
            <IconSymbol name="chevron.left" size={24} color="#ffffff" />
          </TouchableOpacity>
        }
        rightElement={null}
      />

      {/* Floating Save Toast */}
      {showSavedMessage && (
        <View style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 110 : 80,
          left: 20,
          right: 20,
          backgroundColor: theme.accentTeal,
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          zIndex: 9999,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        }}>
          <IconSymbol name="checkmark.circle.fill" size={22} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Trip Plan Updated</Text>
        </View>
      )}

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 220 }]} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Editor Header */}
        <View style={styles.editorHeader}>
          <TextInput 
            style={[styles.input, { fontSize: 24, marginBottom: 12 }]}
            value={record.title}
            onChangeText={(t) => setRecord({ ...record, title: t })}
            onBlur={() => {
              if (record) {
                const updatedPlan = { ...record.data, title: record.title };
                saveChanges(updatedPlan);
              }
            }}
            onSubmitEditing={() => {
              if (record) {
                const updatedPlan = { ...record.data, title: record.title };
                saveChanges(updatedPlan);
              }
            }}
            placeholder="Trip Name"
            placeholderTextColor={theme.tertiary}
          />
          <Text style={styles.label}>Trip Start Date</Text>
          <TouchableOpacity 
            style={[styles.dateInputBox, { justifyContent: 'space-between' }]} 
            onPress={() => setShowDatePicker(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <IconSymbol name="calendar" size={16} color={theme.accent} />
              <Text style={{ color: theme.primary, fontSize: 15, fontWeight: '600' }}>
                {formatDateString(record.startDate)}
              </Text>
            </View>
            {getDaysToGo(record.startDate) ? (
              <View style={{ 
                backgroundColor: theme.accentOrange + '20', 
                paddingHorizontal: 10, 
                paddingVertical: 4, 
                borderRadius: 8 
              }}>
                <Text style={{ color: theme.accentOrange, fontSize: 12, fontWeight: '700' }}>
                  {getDaysToGo(record.startDate)}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>

          <Modal 
            visible={showDatePicker} 
            transparent 
            animationType="fade" 
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
              {Platform.OS === 'web' ? (
                <WebCalendar
                  value={record.startDate ? new Date(record.startDate) : new Date()}
                  colorScheme={colorScheme ?? 'light'}
                  onChange={(d) => {
                    const dateString = d.toISOString().split('T')[0];
                    const updatedData = { ...record.data };
                    if (updatedData.days.length > 0) {
                      updatedData.days[0].date = dateString;
                    }
                    saveChanges(updatedData, record.totalCost, dateString);
                  }}
                  onClose={() => setShowDatePicker(false)}
                />
              ) : (
                <View style={{ backgroundColor: colorScheme === 'dark' ? '#052e16' : '#ffffff', borderRadius: 20, overflow: 'hidden', padding: 8 }}>
                  <DateTimePicker
                    value={record.startDate ? new Date(record.startDate) : new Date()}
                    mode="date"
                    display="inline"
                    minimumDate={new Date()}
                    accentColor="#2e8b58"
                    themeVariant={colorScheme ?? 'light'}
                    onChange={(_e, date) => {
                      if (date) {
                        const dateString = date.toISOString().split('T')[0];
                        const updatedData = { ...record.data };
                        if (updatedData.days.length > 0) {
                          updatedData.days[0].date = dateString;
                        }
                        saveChanges(updatedData, record.totalCost, dateString);
                      }
                      setShowDatePicker(false);
                    }}
                  />
                </View>
              )}
            </View>
          </Modal>
          
          {/* Trip To Dos Section */}
          <View style={{ marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: theme.border }}>
            <View style={styles.sectionHeader}>
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} 
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setTodosCollapsed(!todosCollapsed);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>Trip To Dos</Text>
                <IconSymbol 
                  name={todosCollapsed ? "chevron.down" : "chevron.up"} 
                  size={16} 
                  color={theme.tertiary} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openNoteModal(null, true)}>
                <Text style={[styles.addBtnText, { color: colorScheme === 'dark' ? '#c084fc' : '#ffffff' }]}>+ ADD TO DO</Text>
              </TouchableOpacity>
            </View>

            {!todosCollapsed && (
              <View>
                {(!record.data.tripNotes || record.data.tripNotes.length === 0) ? (
                  <Text style={{ color: colorScheme === 'dark' ? theme.tertiary : 'rgba(255, 255, 255, 0.8)', fontSize: 13, fontStyle: 'italic', paddingHorizontal: 4, marginBottom: 12 }}>
                    No To Dos yet. Tap + ADD TO DO to create one.
                  </Text>
                ) : (
                  record.data.tripNotes.map(note => {
                    const isDone = !!note.completed;
                    return (
                      <View 
                        key={note.id} 
                        style={[
                          styles.todoCard, 
                          isDone && styles.todoCardCompleted
                        ]}
                      >
                        {/* Checkbox button */}
                        <TouchableOpacity 
                          style={styles.todoCheckbox}
                          onPress={() => toggleTodoCompletion(note.id)}
                          activeOpacity={0.6}
                        >
                          <IconSymbol 
                            name={isDone ? "checkmark.square.fill" : "square"} 
                            size={24} 
                            color={colorScheme === 'dark' ? '#c084fc' : '#8b5cf6'} 
                          />
                        </TouchableOpacity>

                        {/* Editable Content clickable area */}
                        <TouchableOpacity 
                          style={styles.todoContent}
                          onPress={() => openNoteModal(null, true, note)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.todoTitle, isDone && styles.todoTitleCompleted]}>
                            {note.title}
                          </Text>
                          {note.text ? (
                            <Text style={[styles.todoText, isDone && styles.todoTextCompleted]} numberOfLines={2}>
                              {note.text}
                            </Text>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    );
                  })
                )}
              </View>
            )}
          </View>
        </View>

        {/* Standout Cost Breakdown Card at the top of the plan list */}
        {record && (
          <View style={styles.costBreakdownCard}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownTitle}>Estimated Cost</Text>
              <Text style={styles.breakdownRange}>
                Rs. {formatCompactCost(Math.round(record.totalCost * 0.9))} - {formatCompactCost(Math.round(record.totalCost * 1.1))}
              </Text>
            </View>
            <View style={styles.breakdownGrid}>
              {/* Travel */}
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownIconContainer}>
                  <IconSymbol name="car.fill" size={16} color={theme.accent} />
                </View>
                <View style={styles.breakdownTextContainer}>
                  <Text style={styles.breakdownLabel}>Travel</Text>
                  <Text style={styles.breakdownValue}>PKR {formatCompactCost(Math.round(record.totalCost * 0.4))}</Text>
                </View>
              </View>

              {/* Accommodation */}
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownIconContainer}>
                  <IconSymbol name="bed.double.fill" size={16} color={theme.accent} />
                </View>
                <View style={styles.breakdownTextContainer}>
                  <Text style={styles.breakdownLabel}>Stay</Text>
                  <Text style={styles.breakdownValue}>PKR {formatCompactCost(Math.round(record.totalCost * 0.35))}</Text>
                </View>
              </View>

              {/* Food */}
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownIconContainer}>
                  <IconSymbol name="fork.knife" size={16} color={theme.accent} />
                </View>
                <View style={styles.breakdownTextContainer}>
                  <Text style={styles.breakdownLabel}>Food</Text>
                  <Text style={styles.breakdownValue}>PKR {formatCompactCost(Math.round(record.totalCost * 0.15))}</Text>
                </View>
              </View>

              {/* Others */}
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownIconContainer}>
                  <IconSymbol name="ellipsis" size={16} color={theme.accent} />
                </View>
                <View style={styles.breakdownTextContainer}>
                  <Text style={styles.breakdownLabel}>Others</Text>
                  <Text style={styles.breakdownValue}>PKR {formatCompactCost(Math.round(record.totalCost * 0.1))}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {record.data.days.map((day) => {
          const isCollapsed = collapsedDays[day.id];

          return (
            <View key={day.id} style={styles.dayContainer}>
              <TouchableOpacity 
                style={styles.dayHeader} 
                onPress={() => toggleDay(day.id)}
                activeOpacity={0.7}
              >
                <View style={styles.dayTitleContainer}>
                  <Text style={styles.dayTitle}>Day {day.dayNumber}</Text>
                  <Text style={styles.dayDate}>{day.date}</Text>
                </View>
                <IconSymbol 
                  name={isCollapsed ? "chevron.down" : "chevron.up"} 
                  size={20} 
                  color={colorScheme === 'dark' ? theme.tertiary : 'rgba(255, 255, 255, 0.8)'} 
                />
              </TouchableOpacity>

              {!isCollapsed && (
                <View style={styles.dayContent}>
                  {/* Departure Time Slider */}
                  <View style={{ marginBottom: 16, backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)', borderRadius: 12, overflow: 'hidden' }}>
                    <TouchableOpacity 
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}
                      onPress={() => setActiveSliderDayId(activeSliderDayId === day.id ? null : day.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colorScheme === 'dark' ? theme.primary : '#ffffff' }}>Departure Time</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: colorScheme === 'dark' ? theme.primary : '#ffffff' }}>
                          {formatTime(day.departureTimeMin)}
                        </Text>
                        <IconSymbol name={activeSliderDayId === day.id ? "chevron.up" : "chevron.down"} size={16} color={colorScheme === 'dark' ? theme.tertiary : 'rgba(255, 255, 255, 0.8)'} />
                      </View>
                    </TouchableOpacity>
                    
                    {activeSliderDayId === day.id && (
                      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                        <Slider 
                          value={day.departureTimeMin} 
                          min={0} 
                          max={1410} // 11:30 PM max
                          step={30} 
                          onValueChange={(val) => setDepartureTime(day.id, val)}
                        />
                      </View>
                    )}
                  </View>

                  {/* Notes Section */}
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Day Notes</Text>
                    <TouchableOpacity onPress={() => openNoteModal(day.id, false)}>
                      <IconSymbol name="plus.circle.fill" size={26} color={colorScheme === 'dark' ? theme.accent : '#ffffff'} />
                    </TouchableOpacity>
                  </View>
                  
                  {day.notes?.map(note => (
                    <TouchableOpacity 
                      key={note.id} 
                      style={styles.noteCard}
                      onPress={() => openNoteModal(day.id, false, note)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.noteIcon}>
                        <IconSymbol name="note.text" size={16} color={theme.accent} />
                      </View>
                      <View style={styles.noteContent}>
                        <Text style={styles.noteTitle}>{note.title}</Text>
                        <Text style={styles.noteText} numberOfLines={2}>{note.text}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}

                  {/* Activities Section */}
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Itinerary</Text>
                    <TouchableOpacity onPress={() => openActivityModal(day.id)}>
                      <Text style={styles.addBtnText}>+ CUSTOM ACTIVITY</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {day.nodes.map((node) => {
                    if (node.type === 'ActivityGroup') {
                      return (
                        <View key={node.id}>
                          <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{node.title || 'Activities'}</Text>
                            <TouchableOpacity onPress={(e) => openMenu(day.id, node.id, e)}>
                              <IconSymbol name="ellipsis" size={24} color={colorScheme === 'dark' ? theme.primary : '#ffffff'} />
                            </TouchableOpacity>
                          </View>
                          {node.items?.map(item => renderOptionalItem(day.id, node.id, item))}
                        </View>
                      );
                    }
                    return renderNode(day.id, node);
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Floating Cost Bar */}
      {record && (
        <Animated.View 
          pointerEvents={showFloatingCost ? "auto" : "none"}
          style={[
            styles.costBar,
            {
              opacity: costBarAnim,
              transform: [
                {
                  translateY: costBarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [120, 0],
                  })
                }
              ]
            }
          ]}
        >
          <View>
            <Text style={styles.costLabel}>Total Estimated Expense</Text>
            <Text style={styles.costValue}>PKR {record.totalCost.toLocaleString()}</Text>
          </View>
          <IconSymbol name="creditcard.fill" size={32} color={theme.accent} />
        </Animated.View>
      )}

      {/* Modals */}
      <Modal
        visible={!!menuConfig}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuConfig(null)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuConfig(null)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0)' }}>
            {menuConfig && (
              <View 
                style={[
                  styles.dropdownMenu, 
                  { 
                    position: 'absolute', 
                    top: menuConfig.y, 
                    left: menuConfig.x,
                    width: 140,
                    padding: 4,
                  }
                ]}
              >
                <TouchableOpacity 
                  style={[styles.dropdownItem, { padding: 8 }]}
                  onPress={() => resetActivityGroup(menuConfig.dayId, menuConfig.groupId)}
                >
                  <Text style={[styles.dropdownText, { marginLeft: 0 }]}>Reset Activities</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={noteModalVisible} animationType="slide" transparent onRequestClose={() => setNoteModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setNoteModalVisible(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <View style={styles.modalIndicator} />
              <Text style={styles.modalTitle}>
                {isTripNote 
                  ? (editingNoteId ? 'Edit To Do' : 'Add New To Do') 
                  : (editingNoteId ? 'Edit Note' : 'Add New Note')
                }
              </Text>
              <TextInput 
                style={styles.modalInput}
                placeholder={isTripNote ? "To Do (e.g. Buy sunscreen)" : "Title (e.g. Hiking Gear)"} 
                placeholderTextColor={theme.tertiary}
                value={noteTitle} onChangeText={setNoteTitle}
              />
              <TextInput 
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder={isTripNote ? "What do you need to do? (Optional details)" : "What do you want to remember?"} 
                placeholderTextColor={theme.tertiary}
                value={noteText} onChangeText={setNoteText} multiline
              />
              <View style={styles.modalActions}>
                {editingNoteId && (
                  <TouchableOpacity 
                    style={[styles.cancelBtn, { flex: 0.5, backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} 
                    onPress={() => {
                      if (editingNoteId) {
                        setPendingDelete({ 
                          type: 'note', 
                          dayId: activeDayId, 
                          id: editingNoteId, 
                          isTrip: isTripNote 
                        });
                        setNoteModalVisible(false);
                      }
                    }}
                  >
                    <IconSymbol name="trash" size={20} color="#ef4444" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setNoteModalVisible(false)}>
                  <Text style={[styles.btnText, { color: theme.primary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
                  <Text style={[styles.btnText, { color: '#fff' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>

      <Modal visible={activityModalVisible} animationType="slide" transparent onRequestClose={() => setActivityModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setActivityModalVisible(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <View style={styles.modalIndicator} />
              <Text style={styles.modalTitle}>
                {editingActivityId ? 'Edit Activity' : 'Add Custom Activity'}
              </Text>
              
              <Text style={styles.modalFieldLabel}>Activity Title</Text>
              <TextInput 
                style={styles.modalInput}
                placeholder="Activity Name (e.g. Sunrise Photo)" placeholderTextColor={theme.tertiary}
                value={actName} onChangeText={setActName}
              />
              
              <Text style={styles.modalFieldLabel}>Time Required</Text>
              <TextInput 
                style={styles.modalInput}
                placeholder="Duration (e.g. 1.5 hrs)" placeholderTextColor={theme.tertiary}
                value={actDuration} onChangeText={setActDuration}
              />
              
              <Text style={styles.modalFieldLabel}>Total Cost Per Person (PKR)</Text>
              <TextInput 
                style={styles.modalInput}
                placeholder="Estimated Cost (PKR)" placeholderTextColor={theme.tertiary}
                value={actCost} onChangeText={setActCost} keyboardType="numeric"
              />
              <View style={styles.modalActions}>
                {editingActivityId && (
                  <TouchableOpacity 
                    style={[styles.cancelBtn, { flex: 0.5, backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} 
                    onPress={() => {
                      if (editingActivityId) {
                        const node = record.data.days.find(d => d.id === activeDayId)?.nodes.find(n => n.id === editingActivityId);
                        setPendingDelete({ 
                          type: 'activity', 
                          dayId: activeDayId, 
                          id: editingActivityId, 
                          cost: node?.cost || 0 
                        });
                        setActivityModalVisible(false);
                      }
                    }}
                  >
                    <IconSymbol name="trash" size={20} color="#ef4444" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setActivityModalVisible(false)}>
                  <Text style={[styles.btnText, { color: theme.primary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveActivity}>
                  <Text style={[styles.btnText, { color: '#fff' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>

      {/* Confirmation Modal */}
      <Modal visible={!!pendingDelete} animationType="fade" transparent onRequestClose={() => setPendingDelete(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { padding: 24, alignItems: 'center' }]}>
            <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 16, borderRadius: 30, marginBottom: 16 }}>
              <IconSymbol name="exclamationmark.triangle.fill" size={32} color="#ef4444" />
            </View>
            <Text style={[styles.modalTitle, { textAlign: 'center', marginBottom: 8 }]}>
              {pendingDelete?.type === 'note' 
                ? (pendingDelete.isTrip ? 'Delete To Do?' : 'Delete Note?') 
                : 'Remove Activity?'
              }
            </Text>
            <Text style={{ textAlign: 'center', color: theme.tertiary, marginBottom: 24, fontSize: 15, lineHeight: 22 }}>
              Are you sure you want to remove this item? This action cannot be undone and will update your timeline.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <TouchableOpacity 
                style={[styles.cancelBtn, { flex: 1 }]} 
                onPress={() => setPendingDelete(null)}
              >
                <Text style={[styles.btnText, { color: theme.primary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveBtn, { flex: 1, backgroundColor: '#ef4444' }]} 
                onPress={() => {
                  if (pendingDelete) {
                    if (pendingDelete.type === 'note') {
                      performNoteDeletion(pendingDelete.dayId, pendingDelete.isTrip || false, pendingDelete.id);
                    } else if (pendingDelete.type === 'activity') {
                      performActivityDeletion(pendingDelete.dayId!, pendingDelete.id, pendingDelete.cost || 0);
                    }
                    setPendingDelete(null);
                  }
                }}
              >
                <Text style={[styles.btnText, { color: '#fff' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
