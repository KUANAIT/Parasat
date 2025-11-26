import { ArrowLeft, Upload, FileText, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface BusinessFormProps {
  onBack: () => void;
  onSubmit: () => void;
}

interface Document {
  name: string;
  size: string;
  type: string;
}

interface DocumentFiles {
  memorandum: Document | null;
  financialReport: Document | null;
  businessPlan: Document | null;
  presentation: Document | null;
  other: Document[];
}

export default function BusinessForm({ onBack, onSubmit }: BusinessFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    founded: '',
    description: '',
    revenue: '',
    profit: '',
    employees: '',
    investmentNeeded: '',
    investmentGoal: '',
    equity: '',
  });

  const [documents, setDocuments] = useState<DocumentFiles>({
    memorandum: null,
    financialReport: null,
    businessPlan: null,
    presentation: null,
    other: [],
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: keyof DocumentFiles) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newDoc: Document = {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
      };
      
      if (docType === 'other') {
        setDocuments({ ...documents, other: [...documents.other, newDoc] });
      } else {
        setDocuments({ ...documents, [docType]: newDoc });
      }
      toast('Документ добавлен');
    }
  };

  const handleRemoveDocument = (docType: keyof DocumentFiles, index?: number) => {
    if (docType === 'other' && index !== undefined) {
      setDocuments({
        ...documents,
        other: documents.other.filter((_, i) => i !== index),
      });
    } else {
      setDocuments({ ...documents, [docType]: null });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.industry || !formData.location || !formData.description) {
      toast('Пожалуйста, заполните все обязательные поля');
      return;
    }

    toast('Инвестиционный запрос создан');
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-[#0A0118]">
      <div className="sticky top-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-purple-600/20 backdrop-blur-2xl border-b border-violet-500/20 px-6 py-5 z-10 shadow-lg shadow-purple-500/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-violet-200" />
          </button>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-fuchsia-200 to-purple-200">Запрос на инвестиции</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 pb-28 space-y-6">
        {/* Основная информация */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600 rounded-[32px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-violet-950/40 via-fuchsia-950/40 to-purple-950/40 backdrop-blur-xl rounded-[32px] p-8 space-y-6 border border-violet-500/20 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse"></div>
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-300">Основная информация</h3>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-violet-200/90 text-sm">Название бизнеса *</Label>
              <Input
                id="name"
                placeholder="Например: Сеть кофеен CoffeeHub"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/30 border-violet-500/30 text-white placeholder:text-violet-300/30 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 rounded-xl h-12 transition-all duration-300"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="industry" className="text-violet-200/90 text-sm">Индустрия *</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger className="bg-black/30 border-violet-500/30 text-white focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 rounded-xl h-12">
                  <SelectValue placeholder="Выберите индустрию" className="text-violet-300/50" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-violet-500/30 backdrop-blur-2xl">
                  <SelectItem value="HoReCa" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">HoReCa (рестораны, кафе)</SelectItem>
                  <SelectItem value="Ритейл" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Ритейл</SelectItem>
                  <SelectItem value="Логистика" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Логистика</SelectItem>
                  <SelectItem value="Производство" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Производство</SelectItem>
                  <SelectItem value="Строительство" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Строительство</SelectItem>
                  <SelectItem value="Фитнес" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Фитнес и спорт</SelectItem>
                  <SelectItem value="Образование" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Образование</SelectItem>
                  <SelectItem value="Здравоохранение" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Здравоохранение</SelectItem>
                  <SelectItem value="Маркетинг" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Маркетинг и реклама</SelectItem>
                  <SelectItem value="IT-услуги" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">IT-услуги</SelectItem>
                  <SelectItem value="Недвижимость" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Недвижимость</SelectItem>
                  <SelectItem value="Другое" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="location" className="text-violet-200/90 text-sm">Локация *</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                  <SelectTrigger className="bg-black/30 border-violet-500/30 text-white focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 rounded-xl h-12">
                    <SelectValue placeholder="Город" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-violet-500/30 backdrop-blur-2xl">
                    <SelectItem value="Алматы" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Алматы</SelectItem>
                    <SelectItem value="Астана" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Астана</SelectItem>
                    <SelectItem value="Шымкент" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Шымкент</SelectItem>
                    <SelectItem value="Караганда" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Караганда</SelectItem>
                    <SelectItem value="Актобе" className="text-violet-100 focus:bg-violet-600/30 focus:text-white">Актобе</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="founded" className="text-violet-200/90 text-sm">Год основания</Label>
                <Input
                  id="founded"
                  type="text"
                  placeholder="2019"
                  value={formData.founded}
                  onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                  className="bg-black/30 border-violet-500/30 text-white placeholder:text-violet-300/30 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 rounded-xl h-12"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="description" className="text-violet-200/90 text-sm">Описание бизнеса *</Label>
              <Textarea
                id="description"
                placeholder="Опишите ваш бизнес, его особенности и преимущества..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="bg-black/30 border-violet-500/30 text-white placeholder:text-violet-300/30 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 rounded-xl resize-none"
              />
            </div>
          </div>
        </div>

        {/* Финансовые показатели */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-[32px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-cyan-950/40 via-blue-950/40 to-indigo-950/40 backdrop-blur-xl rounded-[32px] p-8 space-y-6 border border-cyan-500/20 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">Финансовые показатели</h3>
            </div>
            <p className="text-sm text-cyan-200/60">Укажите годовые показатели в тенге</p>

            <div className="space-y-2.5">
              <Label htmlFor="revenue" className="text-cyan-200/90 text-sm">Годовая выручка (₸)</Label>
              <Input
                id="revenue"
                type="text"
                placeholder="180000000"
                value={formData.revenue}
                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                className="bg-black/30 border-cyan-500/30 text-white placeholder:text-cyan-300/30 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="profit" className="text-cyan-200/90 text-sm">Чистая прибыль (₸)</Label>
              <Input
                id="profit"
                type="text"
                placeholder="36000000"
                value={formData.profit}
                onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
                className="bg-black/30 border-cyan-500/30 text-white placeholder:text-cyan-300/30 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="employees" className="text-cyan-200/90 text-sm">Количество сотрудников</Label>
              <Input
                id="employees"
                type="text"
                placeholder="45"
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                className="bg-black/30 border-cyan-500/30 text-white placeholder:text-cyan-300/30 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 rounded-xl h-12"
              />
            </div>
          </div>
        </div>

        {/* Инвестиционный запрос */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-[32px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-emerald-950/40 via-green-950/40 to-teal-950/40 backdrop-blur-xl rounded-[32px] p-8 space-y-6 border border-emerald-500/20 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300">Инвестиционный запрос</h3>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="investmentNeeded" className="text-emerald-200/90 text-sm">Запрашиваемая сумма (₸)</Label>
              <Input
                id="investmentNeeded"
                type="text"
                placeholder="50000000"
                value={formData.investmentNeeded}
                onChange={(e) => setFormData({ ...formData, investmentNeeded: e.target.value })}
                className="bg-black/30 border-emerald-500/30 text-white placeholder:text-emerald-300/30 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="investmentGoal" className="text-emerald-200/90 text-sm">Цель инвестиций</Label>
              <Textarea
                id="investmentGoal"
                placeholder="Например: Открытие 5 новых точек в Астане"
                value={formData.investmentGoal}
                onChange={(e) => setFormData({ ...formData, investmentGoal: e.target.value })}
                rows={3}
                className="bg-black/30 border-emerald-500/30 text-white placeholder:text-emerald-300/30 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 rounded-xl resize-none"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="equity" className="text-emerald-200/90 text-sm">Предлагаемая доля (%)</Label>
              <Input
                id="equity"
                type="text"
                placeholder="15"
                value={formData.equity}
                onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                className="bg-black/30 border-emerald-500/30 text-white placeholder:text-emerald-300/30 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 rounded-xl h-12"
              />
            </div>
          </div>
        </div>

        {/* Документы */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-[32px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-orange-950/40 via-amber-950/40 to-yellow-950/40 backdrop-blur-xl rounded-[32px] p-8 space-y-6 border border-orange-500/20 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse"></div>
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-300">Документы</h3>
            </div>
            <p className="text-sm text-orange-200/60">Добавьте подтверждающие документы</p>

            <div className="space-y-4">
              {/* Меморандум */}
              <div className="space-y-2.5">
                <input
                  id="memorandum"
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                  onChange={(e) => handleFileUpload(e, 'memorandum')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gradient-to-r from-violet-600/10 to-purple-600/10 border-violet-500/30 text-violet-200 hover:bg-violet-600/20 hover:border-violet-400/50 transition-all duration-300 h-12 rounded-xl"
                  onClick={() => document.getElementById('memorandum')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Инвестиционный меморандум
                </Button>

                {documents.memorandum && (
                  <div className="flex items-center justify-between p-4 bg-black/20 border border-violet-500/20 rounded-xl backdrop-blur-sm group/doc hover:border-violet-400/40 transition-all">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-violet-500/10 rounded-lg">
                        <FileText className="w-5 h-5 text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{documents.memorandum.name}</p>
                        <p className="text-xs text-violet-300/50">{documents.memorandum.type} • {documents.memorandum.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument('memorandum')}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Финансовый отчет */}
              <div className="space-y-2.5">
                <input
                  id="financialReport"
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                  onChange={(e) => handleFileUpload(e, 'financialReport')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border-cyan-500/30 text-cyan-200 hover:bg-cyan-600/20 hover:border-cyan-400/50 transition-all duration-300 h-12 rounded-xl"
                  onClick={() => document.getElementById('financialReport')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Финансовый отчет
                </Button>

                {documents.financialReport && (
                  <div className="flex items-center justify-between p-4 bg-black/20 border border-cyan-500/20 rounded-xl backdrop-blur-sm group/doc hover:border-cyan-400/40 transition-all">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <FileText className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{documents.financialReport.name}</p>
                        <p className="text-xs text-cyan-300/50">{documents.financialReport.type} • {documents.financialReport.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument('financialReport')}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Бизнес-план */}
              <div className="space-y-2.5">
                <input
                  id="businessPlan"
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                  onChange={(e) => handleFileUpload(e, 'businessPlan')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gradient-to-r from-emerald-600/10 to-green-600/10 border-emerald-500/30 text-emerald-200 hover:bg-emerald-600/20 hover:border-emerald-400/50 transition-all duration-300 h-12 rounded-xl"
                  onClick={() => document.getElementById('businessPlan')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Бизнес-план
                </Button>

                {documents.businessPlan && (
                  <div className="flex items-center justify-between p-4 bg-black/20 border border-emerald-500/20 rounded-xl backdrop-blur-sm group/doc hover:border-emerald-400/40 transition-all">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <FileText className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{documents.businessPlan.name}</p>
                        <p className="text-xs text-emerald-300/50">{documents.businessPlan.type} • {documents.businessPlan.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument('businessPlan')}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Презентация */}
              <div className="space-y-2.5">
                <input
                  id="presentation"
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                  onChange={(e) => handleFileUpload(e, 'presentation')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gradient-to-r from-pink-600/10 to-rose-600/10 border-pink-500/30 text-pink-200 hover:bg-pink-600/20 hover:border-pink-400/50 transition-all duration-300 h-12 rounded-xl"
                  onClick={() => document.getElementById('presentation')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Презентация
                </Button>

                {documents.presentation && (
                  <div className="flex items-center justify-between p-4 bg-black/20 border border-pink-500/20 rounded-xl backdrop-blur-sm group/doc hover:border-pink-400/40 transition-all">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-pink-500/10 rounded-lg">
                        <FileText className="w-5 h-5 text-pink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{documents.presentation.name}</p>
                        <p className="text-xs text-pink-300/50">{documents.presentation.type} • {documents.presentation.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument('presentation')}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Другие документы */}
              <div className="space-y-2.5">
                <input
                  id="documents"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xlsx,.xls"
                  onChange={(e) => handleFileUpload(e, 'other')}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gradient-to-r from-slate-600/10 to-gray-600/10 border-slate-500/30 text-slate-200 hover:bg-slate-600/20 hover:border-slate-400/50 transition-all duration-300 h-12 rounded-xl"
                  onClick={() => document.getElementById('documents')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Другие документы
                </Button>

                {documents.other.length > 0 && (
                  <div className="space-y-2.5">
                    {documents.other.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-black/20 border border-slate-500/20 rounded-xl backdrop-blur-sm group/doc hover:border-slate-400/40 transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-slate-500/10 rounded-lg">
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{doc.name}</p>
                            <p className="text-xs text-slate-300/50">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument('other', index)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Предупреждение */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-10"></div>
          <div className="relative bg-gradient-to-r from-blue-950/30 via-indigo-950/30 to-purple-950/30 backdrop-blur-xl rounded-3xl p-6 border border-blue-500/20">
            <p className="text-sm text-blue-200/80">
              <strong className="text-white">⚡ Важно:</strong> Убедитесь, что все финансовые данные точны и актуальны. Инвесторы могут запросить подтверждающие документы.
            </p>
          </div>
        </div>

        {/* Кнопка публикации */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/60 backdrop-blur-2xl border-t border-violet-500/20 p-5 z-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <Button 
              type="submit" 
              className="relative w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-purple-500 text-white border-0 shadow-2xl h-14 rounded-2xl transition-all duration-300" 
              size="lg"
            >
              <span className="text-base">Опубликовать запрос</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}