import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Building2, Clock, CheckCircle, Trash2, Eye } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { apiCall } from '@/lib/api';
import { toast } from 'sonner';

interface DashboardPageProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [estimations, setEstimations] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      onNavigate('home');
      return;
    }
    fetchData();
  }, [isAdmin]);

  async function fetchData() {
    try {
      const [statsData, propertiesData, usersData, estimationsData] = await Promise.all([
        apiCall('/admin/stats'),
        apiCall('/properties?status=all'),
        apiCall('/admin/users'),
        apiCall('/estimations'),
      ]);

      setStats(statsData.stats);

      // Parse images for properties
      const parsedProperties = (propertiesData.properties || []).map((p: any) => {
        if (typeof p.images === 'string') {
          try {
            p.images = JSON.parse(p.images);
          } catch (e) {
            p.images = [];
          }
        }
        if (!Array.isArray(p.images)) p.images = [];
        return p;
      });

      setProperties(parsedProperties);
      setUsers(usersData.users);
      setEstimations(estimationsData.estimations);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  }

  async function handlePropertyStatus(propertyId: string, status: string) {
    try {
      await apiCall(`/properties/${propertyId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      toast.success(t('success'));
      fetchData();
    } catch (error) {
      toast.error(t('error'));
    }
  }

  async function handleDeleteProperty(propertyId: string) {
    if (!confirm('Are you sure?')) return;

    try {
      await apiCall(`/properties/${propertyId}`, {
        method: 'DELETE',
      });
      toast.success(t('success'));
      fetchData();
    } catch (error) {
      toast.error(t('error'));
    }
  }

  async function handleDeleteEstimation(estimationId: string) {
    if (!confirm('Are you sure?')) return;

    try {
      await apiCall(`/estimations/${estimationId}`, {
        method: 'DELETE',
      });
      toast.success(t('success'));
      fetchData();
    } catch (error) {
      toast.error(t('error'));
    }
  }

  async function handleUserRole(userId: string, role: string) {
    try {
      await apiCall(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
      toast.success(t('success'));
      fetchData();
    } catch (error) {
      toast.error(t('error'));
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-warm-brown pb-32">
      {/* Refined Header */}
      <div className="pt-40 pb-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-warm-brown text-[10px] tracking-[0.5em] uppercase font-medium">
              Admin Command
            </span>
            <h1 className="text-5xl md:text-6xl font-serif">
              {t('adminDashboard')}
            </h1>
            <p className="text-white/40 text-sm tracking-[0.2em] uppercase font-light">
              Welcome back, {user?.firstName}.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { label: 'totalUsers', value: stats?.totalUsers, icon: Users, color: 'text-blue-400' },
            { label: 'totalProperties', value: stats?.totalProperties, icon: Building2, color: 'text-green-400' },
            { label: 'pendingProperties', value: stats?.pendingProperties, icon: Clock, color: 'text-warm-brown' },
            { label: 'totalEstimations', value: stats?.totalEstimations, icon: CheckCircle, color: 'text-purple-400' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0a] border border-white/5 p-8 space-y-4"
            >
              <div className="flex items-center justify-between">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <span className="text-[10px] tracking-widest text-white/20 uppercase font-bold">DE/0{i + 1}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t(stat.label as any)}</p>
                <p className="text-4xl font-light tracking-tighter">{stat.value || 0}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs / Tables */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="properties" className="space-y-12">
            <TabsList className="bg-white/5 border border-white/10 p-1 w-full md:w-auto h-auto rounded-none">
              <TabsTrigger value="properties" className="data-[state=active]:bg-warm-brown data-[state=active]:text-white rounded-none py-3 px-8 text-[10px] uppercase tracking-widest">{t('manageProperties')}</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-warm-brown data-[state=active]:text-white rounded-none py-3 px-8 text-[10px] uppercase tracking-widest">{t('manageUsers')}</TabsTrigger>
              <TabsTrigger value="estimations" className="data-[state=active]:bg-warm-brown data-[state=active]:text-white rounded-none py-3 px-8 text-[10px] uppercase tracking-widest">{t('manageEstimations')}</TabsTrigger>
            </TabsList>

            {/* Properties Tab */}
            <TabsContent value="properties" className="space-y-8 animate-in fade-in duration-700">
              <div className="bg-[#0a0a0a] border border-white/5">
                <Table>
                  <TableHeader className="border-b border-white/5">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('category')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('city')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('priceLabel')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('status')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((prop: any) => (
                      <TableRow key={prop.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                        <TableCell className="font-serif text-lg py-6">{t(prop.category)}</TableCell>
                        <TableCell className="text-[10px] tracking-widest uppercase text-white/60">{prop.city}</TableCell>
                        <TableCell className="font-light tracking-widest">{formatPrice(prop.price)}</TableCell>
                        <TableCell>
                          <Badge className={`rounded-none text-[8px] tracking-[0.2em] uppercase px-3 py-1 border-none ${prop.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                            prop.status === 'pending' ? 'bg-warm-brown/10 text-warm-brown' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                            {t(prop.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <button onClick={() => onNavigate('property-detail', prop.id)} className="text-white/40 hover:text-white transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            {prop.status === 'pending' && (
                              <div className="flex gap-2">
                                <button onClick={() => handlePropertyStatus(prop.id, 'approved')} className="bg-green-500/20 text-green-500 px-4 py-1 text-[8px] tracking-widest uppercase hover:bg-green-500/40 transition-colors">{t('approve')}</button>
                                <button onClick={() => handlePropertyStatus(prop.id, 'rejected')} className="bg-red-500/20 text-red-500 px-4 py-1 text-[8px] tracking-widest uppercase hover:bg-red-500/40 transition-colors">{t('reject')}</button>
                              </div>
                            )}
                            <button onClick={() => handleDeleteProperty(prop.id)} className="text-white/20 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-8 animate-in fade-in duration-700">
              <div className="bg-[#0a0a0a] border border-white/5">
                <Table>
                  <TableHeader className="border-b border-white/5">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('name')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('email')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('role')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u: any) => (
                      <TableRow key={u.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                        <TableCell className="font-serif text-lg py-6">{u.firstName} {u.lastName}</TableCell>
                        <TableCell className="text-white/60 font-light">{u.email}</TableCell>
                        <TableCell>
                          <Badge className={`rounded-none text-[8px] tracking-[0.2em] uppercase px-3 py-1 border-none ${u.role === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'bg-white/10 text-white/40'
                            }`}>
                            {t(u.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                              className="text-[10px] tracking-widest uppercase text-warm-brown hover:text-white transition-colors"
                            >
                              {t('changeRole')}
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Estimations Tab */}
            <TabsContent value="estimations" className="space-y-8 animate-in fade-in duration-700">
              <div className="bg-[#0a0a0a] border border-white/5">
                <Table>
                  <TableHeader className="border-b border-white/5">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('name')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('propertyType')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('city')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('date')}</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-widest text-white/40 h-16">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estimations.map((est: any) => (
                      <TableRow key={est.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                        <TableCell className="font-serif text-lg py-6">{est.name}</TableCell>
                        <TableCell className="text-[10px] tracking-widest uppercase text-warm-brown">{t(est.propertyType)}</TableCell>
                        <TableCell className="text-white/60 font-light">{est.city}</TableCell>
                        <TableCell className="text-white/40 text-[10px]">{formatDate(est.createdAt)}</TableCell>
                        <TableCell>
                          <button onClick={() => handleDeleteEstimation(est.id)} className="text-white/20 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
