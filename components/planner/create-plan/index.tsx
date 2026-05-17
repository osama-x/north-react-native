import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  LayoutChangeEvent,
  GestureResponderEvent,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { createStyles } from './create-plan.styles';
import { TripConfig } from './types';
import { Colors } from '@/constants/theme';
import { LocationService, LocationSuggestion } from '../location.service';
import { NorthHeader } from '@/components/ui/north-header';
import { Config } from '@/constants/config';

interface Props {
  initialDestination?: string;
  onBack?: () => void;
  onContinue: (config: TripConfig) => void;
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

// ─────────────────────────────────────────────────────────────────────────────

export default function CreatePlanComponent({ initialDestination, onBack, onContinue }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = useMemo(() => createStyles(colorScheme), [colorScheme]);
  const theme = Colors[colorScheme];

  // ── Slider refs ──────────────────────────────────────────────────────────────
  const trackRef = useRef<View>(null);
  const [trackInfo, setTrackInfo] = useState({ x: 0, width: 0 });
  const [isSliding, setIsSliding] = useState(false);

  const onTrackLayout = () => {
    trackRef.current?.measure((_x, _y, width, _h, pageX) => {
      setTrackInfo({ x: pageX, width });
    });
  };

  const handleSliderChange = (event: GestureResponderEvent, type: 'duration' | 'budget') => {
    if (trackInfo.width === 0) return;
    setIsSliding(true);
    const { pageX } = event.nativeEvent;
    const pct = Math.max(0, Math.min(1, (pageX - trackInfo.x) / trackInfo.width));
    if (type === 'duration') {
      setConfig(prev => ({ ...prev, duration: Math.max(1, Math.round(pct * 14)) }));
    } else {
      const value = Math.round((pct * 490000 + 10000) / 5000) * 5000;
      setConfig(prev => ({ ...prev, budget: value }));
    }
  };

  // ── Config state ─────────────────────────────────────────────────────────────
  const [config, setConfig] = useState<TripConfig>({
    sourceCity: 'Islamabad',
    destinationCity: initialDestination || '',
    departureDate: new Date(),
    returnDate: new Date(Date.now() + 3 * 86400000),
    duration: 3,
    budget: 50000,
    travelers: { adults: 1, children: 0, infants: 0 },
    transportMode: 'Car',
    drivingHoursPerDay: 8,
  });

  // Auto-calculate return date when departure or duration changes
  useEffect(() => {
    const ret = new Date(config.departureDate);
    ret.setDate(ret.getDate() + config.duration);
    setConfig(prev => ({ ...prev, returnDate: ret }));
  }, [config.departureDate, config.duration]);

  // Enforce 'Car' as selected transport mode when it's the only option
  useEffect(() => {
    if (!Config.FEATURES.ENABLE_BUS_AND_FLIGHT && config.transportMode !== 'Car') {
      setConfig(prev => ({ ...prev, transportMode: 'Car' }));
    }
  }, [config.transportMode]);

  // ── Location search state ────────────────────────────────────────────────────
  const [sourceSearch, setSourceSearch] = useState(config.sourceCity);
  const [destSearch, setDestSearch] = useState(config.destinationCity);
  const [sourceSuggestions, setSourceSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);
  const [activeField, setActiveField] = useState<'source' | 'destination' | null>(null);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0 });
  const sourceInputRef = useRef<View>(null);
  const destInputRef = useRef<View>(null);

  const measureAndOpen = (field: 'source' | 'destination') => {
    const ref = field === 'source' ? sourceInputRef : destInputRef;
    ref.current?.measureInWindow((x, y, width, height) => {
      setDropdownLayout({ x, y: y + height + 4, width });
      setActiveField(field);
    });
  };

  useEffect(() => {
    if (!activeField) return;
    const timer = setTimeout(() => {
      if (sourceSearch.trim().length >= 2) fetchSuggestions('source', sourceSearch);
      else setSourceSuggestions([]);
    }, 500);
    return () => clearTimeout(timer);
  }, [sourceSearch]);

  useEffect(() => {
    if (!activeField) return;
    const timer = setTimeout(() => {
      if (destSearch.trim().length >= 2) fetchSuggestions('destination', destSearch);
      else setDestSuggestions([]);
    }, 500);
    return () => clearTimeout(timer);
  }, [destSearch]);

  const fetchSuggestions = async (type: 'source' | 'destination', query: string) => {
    const results = await LocationService.searchLocations(query, type === 'destination', type === 'destination' ? 5 : 10);
    type === 'source' ? setSourceSuggestions(results) : setDestSuggestions(results);
  };

  const handleSelectLocation = (type: 'source' | 'destination', loc: LocationSuggestion) => {
    if (type === 'source') {
      setConfig(prev => ({ ...prev, sourceCity: loc.name }));
      setSourceSearch(loc.name);
      setSourceSuggestions([]);
    } else {
      setConfig(prev => ({ ...prev, destinationCity: loc.name }));
      setDestSearch(loc.name);
      setDestSuggestions([]);
    }
    setActiveField(null);
  };

  // ── Date picker state ────────────────────────────────────────────────────────
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });

  // ── Validation ───────────────────────────────────────────────────────────────
  const isValid = config.sourceCity.trim().length > 0
    && config.destinationCity.trim().length > 0
    && config.departureDate !== null
    && config.travelers.adults > 0;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const updateTravelers = (type: keyof TripConfig['travelers'], delta: number) => {
    setConfig(prev => ({
      ...prev,
      travelers: { ...prev.travelers, [type]: Math.max(0, prev.travelers[type] + delta) },
    }));
  };

  const renderCounter = (label: string, sub: string, type: keyof TripConfig['travelers']) => (
    <View style={styles.travelerRow}>
      <View style={styles.travelerInfo}>
        <Text style={styles.travelerLabel}>{label}</Text>
        <Text style={styles.travelerSub}>{sub}</Text>
      </View>
      <View style={styles.counter}>
        <TouchableOpacity style={styles.counterButton} onPress={() => updateTravelers(type, -1)}>
          <IconSymbol name="minus" size={16} color={theme.primary} />
        </TouchableOpacity>
        <Text style={styles.counterValue}>{config.travelers[type]}</Text>
        <TouchableOpacity style={styles.counterButton} onPress={() => updateTravelers(type, 1)}>
          <IconSymbol name="plus" size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTransportButton = (mode: TripConfig['transportMode'], icon: string) => (
    <TouchableOpacity
      style={[styles.transportButton, config.transportMode === mode && styles.transportButtonActive]}
      onPress={() => setConfig(prev => ({ ...prev, transportMode: mode }))}
    >
      <IconSymbol name={icon as any} size={24} color={config.transportMode === mode ? theme.accent : theme.tertiary} />
      <Text style={[styles.transportLabel, config.transportMode === mode && { color: theme.accent }]}>By {mode}</Text>
      {config.transportMode === mode && <IconSymbol name="checkmark.circle.fill" size={20} color={theme.accent} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NorthHeader
        leftElement={
          onBack ? (
            <TouchableOpacity
              style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 }}
              onPress={onBack}
            >
              <IconSymbol name="chevron.left" size={24} color="#ffffff" />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!isSliding}
      >
        <View style={styles.header}>
          <Text style={styles.phaseText}>Phase 01 — Logistics</Text>
          <Text style={styles.title}>Configure Your Expedition</Text>
        </View>

        {/* ── Source & Destination ──────────────────────────────────────────── */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.flex1]}>
            <Text style={styles.label}>From</Text>
            <View ref={sourceInputRef}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Islamabad"
                placeholderTextColor={theme.tertiary}
                value={sourceSearch}
                onFocus={() => measureAndOpen('source')}
                onChangeText={setSourceSearch}
              />
            </View>
          </View>
          <View style={[styles.inputContainer, styles.flex1]}>
            <Text style={styles.label}>To</Text>
            <View ref={destInputRef}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Skardu"
                placeholderTextColor={theme.tertiary}
                value={destSearch}
                onFocus={() => measureAndOpen('destination')}
                onChangeText={setDestSearch}
              />
            </View>
          </View>
        </View>

        {/* ── Trip Duration (ABOVE dates) ────────────────────────────────────── */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.label}>Trip Duration</Text>
            <Text style={styles.sliderValue}>{config.duration} {config.duration === 1 ? 'Day' : 'Days'}</Text>
          </View>
          <View
            ref={trackRef}
            style={styles.sliderTrack}
            onLayout={onTrackLayout}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => handleSliderChange(e, 'duration')}
            onResponderMove={(e) => handleSliderChange(e, 'duration')}
            onResponderRelease={() => setIsSliding(false)}
            onResponderTerminate={() => setIsSliding(false)}
            onResponderTerminationRequest={() => false}
          >
            <View style={[styles.sliderFill, { width: `${(config.duration / 14) * 100}%` }]}>
              <View style={styles.sliderThumb} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={{ color: theme.tertiary, fontSize: 11 }}>1 Day</Text>
            <Text style={{ color: theme.tertiary, fontSize: 11 }}>14 Days</Text>
          </View>
        </View>

        {/* ── Departure & Return dates ───────────────────────────────────────── */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.flex1]}>
            <Text style={styles.label}>Departure</Text>
            <TouchableOpacity style={styles.dateInputBox} onPress={() => setShowDatePicker(true)}>
              <IconSymbol name="calendar" size={16} color={theme.accent} />
              <Text style={{ color: theme.primary, fontSize: 15, fontWeight: '600' }}>
                {formatDate(config.departureDate)}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputContainer, styles.flex1]}>
            <Text style={styles.label}>Return (Auto)</Text>
            <View style={[styles.dateInputBox, { opacity: 0.7 }]}>
              <IconSymbol name="calendar" size={16} color={theme.tertiary} />
              <Text style={{ color: theme.primary, fontSize: 15 }}>
                {formatDate(config.returnDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Budget ────────────────────────────────────────────────────────── */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.label}>Budget Ceiling</Text>
            <Text style={styles.sliderValue}>PKR {config.budget.toLocaleString()}</Text>
          </View>
          <View
            style={styles.sliderTrack}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={(e) => handleSliderChange(e, 'budget')}
            onResponderMove={(e) => handleSliderChange(e, 'budget')}
            onResponderRelease={() => setIsSliding(false)}
            onResponderTerminate={() => setIsSliding(false)}
            onResponderTerminationRequest={() => false}
          >
            <View style={[styles.sliderFill, { width: `${((config.budget - 10000) / 490000) * 100}%` }]}>
              <View style={styles.sliderThumb} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={{ color: theme.tertiary, fontSize: 11 }}>PKR 10K</Text>
            <Text style={{ color: theme.tertiary, fontSize: 11 }}>PKR 500K</Text>
          </View>
        </View>

        {/* ── Travelers ────────────────────────────────────────────────────── */}
        <Text style={styles.label}>Travelers</Text>
        <View style={styles.travelerSection}>
          {renderCounter('Adults', '12+ yrs', 'adults')}
          {renderCounter('Children', '2-12 yrs', 'children')}
          {renderCounter('Infants', '0-2 yrs', 'infants')}
        </View>

        {/* ── Transport ────────────────────────────────────────────────────── */}
        <Text style={styles.label}>Mode of Transport</Text>
        <View style={styles.transportSection}>
          {renderTransportButton('Car', 'car.fill')}
          {Config.FEATURES.ENABLE_BUS_AND_FLIGHT && renderTransportButton('Bus', 'bus.fill')}
          {Config.FEATURES.ENABLE_BUS_AND_FLIGHT && renderTransportButton('Flight', 'airplane')}
        </View>

        {/* ── Driving hours (Car only) ──────────────────────────────────────── */}
        {config.transportMode === 'Car' && (
          <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.label}>Preferred Driving Hours / Day</Text>
              <Text style={styles.sliderValue}>{config.drivingHoursPerDay ?? 8} hrs</Text>
            </View>
            <View
              style={styles.sliderTrack}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={(e) => {
                setIsSliding(true);
                if (trackInfo.width === 0) return;
                const pct = Math.max(0, Math.min(1, (e.nativeEvent.pageX - trackInfo.x) / trackInfo.width));
                setConfig(prev => ({ ...prev, drivingHoursPerDay: Math.max(4, Math.round(pct * 8 + 4)) }));
              }}
              onResponderMove={(e) => {
                if (trackInfo.width === 0) return;
                const pct = Math.max(0, Math.min(1, (e.nativeEvent.pageX - trackInfo.x) / trackInfo.width));
                setConfig(prev => ({ ...prev, drivingHoursPerDay: Math.max(4, Math.round(pct * 8 + 4)) }));
              }}
              onResponderRelease={() => setIsSliding(false)}
              onResponderTerminate={() => setIsSliding(false)}
              onResponderTerminationRequest={() => false}
            >
              <View style={[styles.sliderFill, { width: `${(((config.drivingHoursPerDay ?? 8) - 4) / 8) * 100}%` }]}>
                <View style={styles.sliderThumb} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <Text style={{ color: theme.tertiary, fontSize: 11 }}>4 hrs (Relaxed)</Text>
              <Text style={{ color: theme.tertiary, fontSize: 11 }}>12 hrs (Full day)</Text>
            </View>
          </View>
        )}

        {/* ── Continue button ───────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.continueButton, !isValid && { opacity: 0.4 }]}
          activeOpacity={0.9}
          disabled={!isValid}
          onPress={() => onContinue(config)}
        >
          <Text style={styles.continueButtonText}>Continue to Itinerary</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Date Picker Modal ─────────────────────────────────────────────────── */}
      <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
          {Platform.OS === 'web' ? (
            <WebCalendar
              value={config.departureDate}
              colorScheme={colorScheme}
              onChange={(d) => setConfig(prev => ({ ...prev, departureDate: d }))}
              onClose={() => setShowDatePicker(false)}
            />
          ) : (
            <View style={{ backgroundColor: colorScheme === 'dark' ? '#052e16' : '#ffffff', borderRadius: 20, overflow: 'hidden' }}>
              <DateTimePicker
                value={config.departureDate}
                mode="date"
                display="inline"
                minimumDate={new Date()}
                accentColor="#2e8b58"
                themeVariant={colorScheme}
                onChange={(_e, date) => {
                  if (date) setConfig(prev => ({ ...prev, departureDate: date }));
                  setShowDatePicker(false);
                }}
              />
            </View>
          )}
        </View>
      </Modal>

      {/* ── Suggestions overlay ───────────────────────────────────────────────── */}
      {!!activeField && (activeField === 'source' ? sourceSuggestions : destSuggestions).length > 0 && (
        <View
          style={{
            position: 'absolute',
            left: dropdownLayout.x,
            top: dropdownLayout.y,
            width: dropdownLayout.width,
            backgroundColor: colorScheme === 'dark' ? '#052e16' : '#ffffff',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#166534' : '#d1d5db',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 20,
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {(activeField === 'source' ? sourceSuggestions : destSuggestions).map((loc, i, arr) => (
            <TouchableOpacity
              key={loc.id}
              onPress={() => handleSelectLocation(activeField, loc)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                borderBottomColor: colorScheme === 'dark' ? '#166534' : '#f3f4f6',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: colorScheme === 'dark' ? '#ffffff' : '#111827' }}>
                {loc.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
