import sys
from Ecg import ECG

ecg = ECG()

filename = sys.argv[1]

ecg_user_image_read = ecg.getImage(f'./assets/img/ECG/{filename}')
ecg_user_gray_image_read = ecg.GrayImgae(ecg_user_image_read)
dividing_leads=ecg.DividingLeads(ecg_user_image_read)
ecg_preprocessed_leads = ecg.PreprocessingLeads(dividing_leads)
ec_signal_extraction = ecg.SignalExtraction_Scaling(dividing_leads)
ecg_1dsignal = ecg.CombineConvert1Dsignal()
ecg_final = ecg.DimensionalReduciton(ecg_1dsignal)
ecg_model=ecg.ModelLoad_predict(ecg_final)

print(ecg_model)


