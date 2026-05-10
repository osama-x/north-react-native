import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Modal, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { dbService, SavedPlanRecord } from '@/database';
import { NorthHeader } from '@/components/ui/north-header';

interface Props {
  onSavedPlanPress?: (id: string) => void;
}

export default function ProfileComponent({ onSavedPlanPress }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [plans, setPlans] = useState<SavedPlanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Header menu state
  const [showMenu, setShowMenu] = useState(false);
  
  // Card-level deletion state
  const [menuPlan, setMenuPlan] = useState<SavedPlanRecord | null>(null);
  const [menuPosition, setMenuPosition] = useState(0);
  const [pendingDeletePlan, setPendingDeletePlan] = useState<SavedPlanRecord | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await dbService.getSavedPlans();
      setPlans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!pendingDeletePlan) return;
    try {
      await dbService.deletePlan(pendingDeletePlan.id);
      setPendingDeletePlan(null);
      fetchPlans();
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPlans();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <NorthHeader 
        title="Profile" 
        rightElement={
          <TouchableOpacity 
            style={styles.headerMenuButton}
            onPress={() => setShowMenu(true)}
          >
            <IconSymbol name="ellipsis" size={24} color="#ffffff" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={[styles.avatarContainer, { borderColor: theme.accent, backgroundColor: theme.accent + '10' }]}>
             <IconSymbol name="person.fill" size={50} color={theme.accent} />
          </View>
          <Text style={[styles.userName, { color: theme.primary }]}>Osama Khan</Text>
          <Text style={[styles.userEmail, { color: theme.tertiary }]}>osama.khan@north.com</Text>
        </View>

        {/* My Plans Section */}
        <View style={styles.plansSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>My Plans</Text>
            <View style={[styles.planCountBadge, { backgroundColor: theme.accent + '20' }]}>
               <Text style={[styles.planCountText, { color: theme.accent }]}>{plans.length}</Text>
            </View>
          </View>
          
          {loading ? (
            <ActivityIndicator size="small" color={theme.accent} style={{ marginTop: 20 }} />
          ) : plans.length > 0 ? (
            plans.map((plan) => (
              <TouchableOpacity 
                key={plan.id} 
                style={[styles.planCard, { backgroundColor: theme.accent + '10', borderColor: theme.accent }]}
                activeOpacity={0.7}
                onPress={() => onSavedPlanPress?.(plan.id)}
              >
                <View style={styles.planInfo}>
                  <Text style={[styles.planTitle, { color: theme.primary }]}>{plan.title}</Text>
                  <Text style={[styles.planDate, { color: theme.tertiary }]}>
                    {new Date(plan.startDate).toLocaleDateString()} • PKR {plan.totalCost.toLocaleString()}
                  </Text>
                </View>
                
                {/* 3-dot Card Menu */}
                <TouchableOpacity 
                  style={styles.cardMenuButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    const { pageY } = e.nativeEvent;
                    setMenuPosition(pageY);
                    setMenuPlan(plan);
                  }}
                >
                  <IconSymbol name="ellipsis" size={20} color={theme.tertiary} />
                </TouchableOpacity>

                <IconSymbol name="chevron.right" size={20} color={theme.accent} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.tertiary }]}>No saved plans yet.</Text>
          )}
        </View>
      </ScrollView>

      {/* ────────────── Header Menu Modal ────────────── */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.dropdownMenu, { backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff', borderColor: theme.border }]}>
                <TouchableOpacity 
                  style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: theme.border }]}
                  onPress={() => setShowMenu(false)}
                >
                  <IconSymbol name="pencil" size={18} color={theme.primary} />
                  <Text style={[styles.menuText, { color: theme.primary }]}>Edit Profile</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: theme.border }]}
                  onPress={() => setShowMenu(false)}
                >
                  <IconSymbol name="gearshape.fill" size={18} color={theme.primary} />
                  <Text style={[styles.menuText, { color: theme.primary }]}>Settings</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => setShowMenu(false)}
                >
                  <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color="#ef4444" />
                  <Text style={[styles.menuText, { color: '#ef4444' }]}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ────────────── Card Dropdown Menu Modal ────────────── */}
      <Modal
        visible={!!menuPlan}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuPlan(null)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuPlan(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.dropdownMenu, { 
                top: menuPosition + 10,
                backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff', 
                borderColor: theme.border 
              }]}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    const plan = menuPlan;
                    setMenuPlan(null);
                    setTimeout(() => setPendingDeletePlan(plan), 200);
                  }}
                >
                  <IconSymbol name="trash" size={17} color="#ef4444" />
                  <Text style={[styles.menuText, { color: '#ef4444' }]}>Delete Plan</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ────────────── Delete Confirmation Modal ────────────── */}
      <Modal
        visible={!!pendingDeletePlan}
        animationType="slide"
        transparent
        onRequestClose={() => setPendingDeletePlan(null)}
      >
        <TouchableWithoutFeedback onPress={() => setPendingDeletePlan(null)}>
          <View style={styles.deleteOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.deleteSheet, { backgroundColor: theme.background }]}>
                <View style={styles.deleteIconContainer}>
                  <IconSymbol name="trash.fill" size={32} color="#ef4444" />
                </View>
                <Text style={[styles.deleteTitle, { color: theme.primary }]}>Delete Plan?</Text>
                <Text style={[styles.deleteMessage, { color: theme.tertiary }]}>
                  "{pendingDeletePlan?.title}" will be permanently removed. This cannot be undone.
                </Text>
                <View style={styles.deleteActionRow}>
                  <TouchableOpacity
                    style={[styles.deleteButton, styles.cancelButton, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}
                    onPress={() => setPendingDeletePlan(null)}
                  >
                    <Text style={[styles.deleteButtonText, { color: theme.primary }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.deleteButton, styles.confirmButton]}
                    onPress={handleDeletePlan}
                  >
                    <Text style={[styles.deleteButtonText, { color: '#fff' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerMenuButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  userInfoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'Outfit-Bold' : 'Inter-Bold',
    fontWeight: '800',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  plansSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    fontWeight: '800',
  },
  planCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  planDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  cardMenuButton: {
    padding: 8,
    marginRight: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Inter-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70,
    right: 20,
    borderRadius: 16,
    paddingVertical: 6,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  deleteSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: Platform.OS === 'ios' ? 48 : 28,
    alignItems: 'center',
  },
  deleteIconContainer: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    padding: 18,
    borderRadius: 30,
    marginBottom: 18,
  },
  deleteTitle: {
    fontSize: 22,
    fontFamily: 'Outfit-Bold',
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  deleteMessage: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  deleteActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
