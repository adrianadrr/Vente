import React, { useState, useMemo } from 'react';
import type { Registrant } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SearchIcon } from './icons/SearchIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import ConfirmationModal from './ConfirmationModal';

interface DataEntryPageProps {
  username: string;
  onLogout: () => void;
}

const initialFormState: Omit<Registrant, 'id' | 'correl'> = {
  cedula: '',
  censo2223: false,
  tipo123: false,
  afiliado: false,
  simpatizante: false,
  codCentroEE: '',
  celular: '',
  telefonoFijo: '',
  email: '',
  usuarioOpcional: '',
  cedulaAdmin: '',
};

const sampleData: Registrant[] = [
    {
        id: 1,
        correl: '00001',
        cedula: '3111111',
        censo2223: true,
        tipo123: true,
        afiliado: true,
        simpatizante: false,
        codCentroEE: '10101001',
        celular: '1929430111',
        telefonoFijo: '584141234567',
        email: 'usuario@gmail.com',
        usuarioOpcional: '',
        cedulaAdmin: '5000000',
    }
];

const DataEntryPage: React.FC<DataEntryPageProps> = ({ username, onLogout }) => {
  const [registrants, setRegistrants] = useState<Registrant[]>(sampleData);
  const [newRecord, setNewRecord] = useState(initialFormState);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    afiliado: false,
    simpatizante: false,
    censo2223: false,
    tipo123: false,
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; recordId: number | null }>({
    isOpen: false,
    recordId: null,
  });
  
  const nextId = useMemo(() => {
    if (registrants.length === 0) return 1;
    return Math.max(...registrants.map(r => r.id)) + 1;
  }, [registrants]);
  
  const filteredRegistrants = useMemo(() => {
    return registrants.filter(r => {
      // Search logic
      const matchesSearch = searchTerm === '' ||
        Object.values(r).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

      if (!matchesSearch) return false;

      // Filter logic
      if (filters.afiliado && !r.afiliado) return false;
      if (filters.simpatizante && !r.simpatizante) return false;
      if (filters.censo2223 && !r.censo2223) return false;
      if (filters.tipo123 && !r.tipo123) return false;
      
      return true;
    });
  }, [registrants, searchTerm, filters]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewRecord(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters(prev => ({
        ...prev,
        [name]: checked,
    }));
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.cedula || !newRecord.cedulaAdmin) {
        alert("Por favor, complete los campos obligatorios: Cédula y Cédula Administrador.");
        return;
    }
    
    const recordToAdd: Registrant = {
      id: nextId,
      correl: String(nextId).padStart(5, '0'),
      ...newRecord,
    };
    setRegistrants(prev => [...prev, recordToAdd]);
    setNewRecord(initialFormState);
  };
  
  const handleDeleteRequest = (id: number) => {
    setDeleteConfirmation({ isOpen: true, recordId: id });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.recordId !== null) {
      setRegistrants(prev => prev.filter(r => r.id !== deleteConfirmation.recordId));
    }
    setDeleteConfirmation({ isOpen: false, recordId: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, recordId: null });
  };
  
  const handleExportCSV = () => {
    if (filteredRegistrants.length === 0) {
      return; // Safeguard, button should be disabled
    }

    const headers = [
      'ID', 'Correl', 'Cédula', 'Censo 22-23', 'Tipo 123', 'Afiliado', 'Simpatizante',
      'Cód. Centro EE', 'Celular', 'Teléfono Fijo', 'Email', 'Usuario Opcional', 'Cédula Admin'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRegistrants.map(r => [
        r.id,
        r.correl,
        `"${r.cedula}"`,
        r.censo2223 ? 'Sí' : 'No',
        r.tipo123 ? 'Sí' : 'No',
        r.afiliado ? 'Sí' : 'No',
        r.simpatizante ? 'Sí' : 'No',
        `"${r.codCentroEE}"`,
        `"${r.celular}"`,
        `"${r.telefonoFijo}"`,
        `"${r.email}"`,
        `"${r.usuarioOpcional}"`,
        `"${r.cedulaAdmin}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      const date = new Date().toISOString().slice(0, 10);
      link.setAttribute("href", url);
      link.setAttribute("download", `registros_${date}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Plataforma de Registro</h1>
              <p className="text-gray-500 dark:text-gray-400">Bienvenido, <span className="font-semibold">{username}</span></p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-colors duration-300"
          >
            Cerrar Sesión
          </button>
        </header>

        <main>
          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">Añadir Nuevo Inscrito</h2>
            <form onSubmit={handleAddRecord}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Form fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Cédula (sin puntos)</label>
                  <input type="text" name="cedula" value={newRecord.cedula} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Cód. Centro EE</label>
                  <input type="text" name="codCentroEE" value={newRecord.codCentroEE} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Celular</label>
                  <input type="tel" name="celular" value={newRecord.celular} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Teléfono Fijo</label>
                  <input type="tel" name="telefonoFijo" value={newRecord.telefonoFijo} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email (Solo Gmail)</label>
                  <input type="email" name="email" value={newRecord.email} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Usuario Opcional (Gmail)</label>
                  <input type="email" name="usuarioOpcional" value={newRecord.usuarioOpcional} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Cédula Administrador</label>
                  <input type="text" name="cedulaAdmin" value={newRecord.cedulaAdmin} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="flex items-center space-x-8 md:col-span-2 lg:col-span-3 pt-4">
                  <div className="flex items-center"><input type="checkbox" name="censo2223" checked={newRecord.censo2223} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><label className="ml-2 text-sm text-gray-600 dark:text-gray-300">Censo 22-23</label></div>
                  <div className="flex items-center"><input type="checkbox" name="tipo123" checked={newRecord.tipo123} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><label className="ml-2 text-sm text-gray-600 dark:text-gray-300">Tipo 123</label></div>
                  <div className="flex items-center"><input type="checkbox" name="afiliado" checked={newRecord.afiliado} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><label className="ml-2 text-sm text-gray-600 dark:text-gray-300">Afiliado</label></div>
                  <div className="flex items-center"><input type="checkbox" name="simpatizante" checked={newRecord.simpatizante} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /><label className="ml-2 text-sm text-gray-600 dark:text-gray-300">Simpatizante</label></div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                  <button type="submit" className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-300">
                      <PlusIcon />
                      <span className="ml-2">Añadir Registro</span>
                  </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                      <div className="relative w-full md:w-auto md:flex-grow">
                          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                              <SearchIcon />
                          </div>
                          <input
                              type="text"
                              placeholder="Buscar en registros..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                      </div>
                       <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-center">
                              <div className="flex items-center">
                                  <input type="checkbox" id="filterAfiliado" name="afiliado" checked={filters.afiliado} onChange={handleFilterChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                  <label htmlFor="filterAfiliado" className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">Afiliado</label>
                              </div>
                              <div className="flex items-center">
                                  <input type="checkbox" id="filterSimpatizante" name="simpatizante" checked={filters.simpatizante} onChange={handleFilterChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                  <label htmlFor="filterSimpatizante" className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">Simpatizante</label>
                              </div>
                              <div className="flex items-center">
                                  <input type="checkbox" id="filterCenso" name="censo2223" checked={filters.censo2223} onChange={handleFilterChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                  <label htmlFor="filterCenso" className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">Censo 22-23</label>
                              </div>
                              <div className="flex items-center">
                                  <input type="checkbox" id="filterTipo" name="tipo123" checked={filters.tipo123} onChange={handleFilterChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                  <label htmlFor="filterTipo" className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">Tipo 123</label>
                              </div>
                          </div>
                          <button
                              onClick={handleExportCSV}
                              disabled={filteredRegistrants.length === 0}
                              className="flex items-center justify-center w-full sm:w-auto px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                              >
                              <DownloadIcon />
                              <span className="ml-2 whitespace-nowrap">
                                  {filteredRegistrants.length > 0 
                                      ? `Exportar ${filteredRegistrants.length} registro(s)`
                                      : 'Nada que exportar'
                                  }
                              </span>
                          </button>
                      </div>
                  </div>
              </div>

              <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                      <tr>
                          <th scope="col" className="px-4 py-3">ID</th>
                          <th scope="col" className="px-4 py-3">Correl</th>
                          <th scope="col" className="px-4 py-3">Cédula</th>
                          <th scope="col" className="px-4 py-3 text-center">Afiliado</th>
                          <th scope="col" className="px-4 py-3 text-center">Simpat.</th>
                          <th scope="col" className="px-4 py-3">Celular</th>
                          <th scope="col" className="px-4 py-3">Email</th>
                          <th scope="col" className="px-4 py-3">Cédula Admin</th>
                          <th scope="col" className="px-4 py-3 text-center">Acciones</th>
                      </tr>
                      </thead>
                      <tbody>
                      {filteredRegistrants.map((r, index) => (
                          <tr key={r.id} className={`border-b dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                          <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{r.id}</td>
                          <td className="px-4 py-4">{r.correl}</td>
                          <td className="px-4 py-4">{r.cedula}</td>
                          <td className="px-4 py-4 text-center">{r.afiliado ? '✔️' : '❌'}</td>
                          <td className="px-4 py-4 text-center">{r.simpatizante ? '✔️' : '❌'}</td>
                          <td className="px-4 py-4">{r.celular}</td>
                          <td className="px-4 py-4">{r.email}</td>
                          <td className="px-4 py-4">{r.cedulaAdmin}</td>
                          <td className="px-4 py-4 text-center">
                              <button onClick={() => handleDeleteRequest(r.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors">
                                  <TrashIcon />
                              </button>
                          </td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
                   {filteredRegistrants.length === 0 && (
                      <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {registrants.length === 0
                          ? "No hay registros para mostrar."
                          : "No se encontraron registros que coincidan con su búsqueda o filtros."}
                      </p>
                    )}
              </div>
          </div>
        </main>
      </div>
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro que desea eliminar el registro con ID ${deleteConfirmation.recordId}? Esta acción no se puede deshacer.`}
      />
    </>
  );
};

export default DataEntryPage;